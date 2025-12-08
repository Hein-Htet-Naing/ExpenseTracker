import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { incomeModel } from "@/model/Income";
import mongoose from "mongoose";
import { validateIncome } from "@/lib/validation";
export async function POST(request: NextRequest) {
  await connectDB();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, message: "No token" },
      { status: 403 }
    );
  }
  let userId;
  try {
    const decoded = verifyToken(token);
    userId = decoded?.id;
  } catch (error: any) {
    console.error("Token verification failed:", error);
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 403 }
    );
  }
  try {
    const { title, amount, categoryId, source, date, description } =
      await request.json();
    // VALIDATE INCOME
    const validateError = validateIncome({
      title,
      amount,
      categoryId,
      source,
      date,
      description,
    });
    if (Object.keys(validateError).length > 0) {
      return NextResponse.json({
        success: false,
        message: "Invalid Data!",
      });
    }
    await incomeModel.create({
      title: title,
      amount: amount,
      categoryId: mongoose.Types.ObjectId.createFromHexString(categoryId),
      source: source,
      description: description,
      date: date,
      userId: mongoose.Types.ObjectId.createFromHexString(userId!),
    });
    // await addIncome.save();
    return NextResponse.json({
      success: true,
      message: "New Income is added successfully!",
    });
  } catch (error: any) {
    console.log("INCOME" + error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request) {
  await connectDB();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid Token!",
      },
      { status: 401 }
    );
  }

  let userId;
  try {
    const decoded = verifyToken(token);
    userId = decoded?.id;
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "",
      },
      {
        status: 401,
      }
    );
  }

  const { searchParams } = new URL(request.url);
  // console.log(searchParams);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");
  const search = searchParams.get("search");
  const categoryId = searchParams.get("category");
  // console.log(search);
  // console.log(categoryId);
  if (isNaN(page))
    return NextResponse.json(
      {
        success: false,
        message: "Invalid Page Number",
      },
      { status: 400 }
    );

  if (isNaN(limit))
    return NextResponse.json(
      {
        success: false,
        message: "Invalid Limit Number",
      },
      { status: 400 }
    );

  const skip = (page - 1) * limit;
  try {
    const pipeline: any = [
      {
        $match: {
          userId: mongoose.Types.ObjectId.createFromHexString(userId!),
          deletedAt: null,
        },
      },
    ];

    if (search?.trim()) {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: search.trim(), $options: "i" } },
            { description: { $regex: search.trim(), $options: "i" } },
          ],
        },
      });
    }

    if (categoryId?.trim()) {
      pipeline.push({
        $match: {
          categoryId: mongoose.Types.ObjectId.createFromHexString(
            categoryId.trim()
          ),
        },
      });
    }
    pipeline.push(
      {
        $sort: { date: -1 },
      },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "categories",
          let: { catId: "$categoryId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$catId"] },
                    { $eq: ["$deletedAt", null] },
                  ],
                },
              },
            },
          ],
          as: "categoryDetails",
        },
      },
      {
        $unwind: {
          path: "$categoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      }
    );
    const listofIncomeWithCategories = await incomeModel.aggregate([pipeline]);
    // console.log(listofIncomeWithCategories);
    //run the code tmr
    const countPipeline = [...pipeline.slice(0, -4), { $count: "total" }];
    const countResult = await incomeModel.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;
    const totalPage = Math.ceil(total / limit);
    return NextResponse.json({
      success: true,
      data: listofIncomeWithCategories,
      pagination: {
        total: total,
        page: page,
        limit: limit,
        totalPage: totalPage,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
