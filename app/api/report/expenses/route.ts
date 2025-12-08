import { expenseModel } from "@/model/Expenses";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { buildExpenseQueryAndPipeline } from "@/helper/queryHelper";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
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
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid Token1" },
      { status: 403 }
    );
  }
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Invalid Token1" },
      { status: 401 }
    );
  }
  const { startDate, endDate, minAmount, maxAmount, categoryIds } =
    await request.json();

  const { pipeline, MonthlySpendingPipeline, CategoriesSpending } =
    buildExpenseQueryAndPipeline({
      userId,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      categoryIds,
    });

  const [summary, monthlySpending, categorySpending] = await Promise.all([
    expenseModel.aggregate(pipeline),
    expenseModel.aggregate(MonthlySpendingPipeline),
    expenseModel.aggregate(CategoriesSpending),
  ]);
  // console.log(summary[0]);
  // console.log(categorySpending[0]);
  if (
    !summary ||
    !summary[0].totalExpenses?.length ||
    !summary[0].monthlyAverage?.length ||
    !summary[0].countExpenses?.length ||
    !summary[0].topCategories?.length
  ) {
    return NextResponse.json({
      success: false,
      message: "No data found for one or more filters.",
    });
  }

  const categoryBreakDown = categorySpending[0].categorySpending || [];
  const monthlyBreakDown = monthlySpending[0].monthlyBreakdown || [];
  try {
    return NextResponse.json({
      success: true,
      data: { summary: summary[0], monthlyBreakDown, categoryBreakDown },
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

export async function GET(request: NextRequest) {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: "No token provided!",
      },
      {
        status: 401,
      }
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
        message: "Unauthenticated!!",
      },
      {
        status: 401,
      }
    );
  }

  try {
    //change to createIndex when users become huge, also change the match
    const getRecentExpense = await expenseModel.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId.createFromHexString(userId!),
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 5 },
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
    // console.log("recent Expenses");
    // console.log(getRecentExpense);

    return NextResponse.json({
      success: true,
      data: getRecentExpense,
    });
  } catch (error: any) {
    console.log("recent error:" + error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
