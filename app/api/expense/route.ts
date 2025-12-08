import { connectDB } from "@/lib/db";
import { expenseModel } from "@/model/Expenses";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import mongoose from "mongoose";
export async function GET(request: Request) {
  await connectDB();
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
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

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");
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

  // Convert to ObjectId if possible for stricter matching
  //aggregate of match piptline is fcking strict about types
  try {
    const listExpenseswithCategories = await expenseModel.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId.createFromHexString(userId!),
        },
      },
      { $sort: { date: -1 } },
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
        $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true },
      },
    ]);
    // console.log("Expenses with Categories:", listExpenseswithCategories);

    const total = await expenseModel.countDocuments({
      userId: mongoose.Types.ObjectId.createFromHexString(userId!),
    });

    return NextResponse.json({
      success: true,
      data: listExpenseswithCategories,
      pagination: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.log("Expense" + error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
//post
export async function POST(request: Request) {
  await connectDB();
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
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
    const { title, amount, categoryId, date, description } =
      await request.json();

    await expenseModel.create({
      title: title,
      amount: amount,
      categoryId: mongoose.Types.ObjectId.createFromHexString(categoryId),
      description: description,
      date: date,
      userId: mongoose.Types.ObjectId.createFromHexString(userId!),
    });
    // await addNewExpense.save();
    return NextResponse.json({
      success: true,
      message: "New Expense is added successfully!",
    });
  } catch (err: any) {
    console.error("Adding Expense error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
