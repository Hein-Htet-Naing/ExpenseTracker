import { expenseModel } from "@/model/Expenses";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { buildExpenseQueryAndPipeline } from "@/helper/queryHelper";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { buildIncomeQueryandPipeline } from "@/helper/queryIncomeHelper";
import { incomeModel } from "@/model/Income";
import { stringify } from "querystring";
import { buildIncomeVsExpense } from "@/helper/queryIncomeVsExpensehelper";
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
  const {
    startDate,
    endDate,
    minAmount,
    maxAmount,
    categoryIds,
    IcategoryIds,
  } = await request.json();
  // Expense
  const { pipeline, MonthlySpendingPipeline, CategoriesSpendings } =
    buildExpenseQueryAndPipeline({
      userId,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      categoryIds,
    });
  //income
  const { IncomePipeline, IncomeByCategories } = buildIncomeQueryandPipeline({
    userId,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    IcategoryIds,
  });

  const { IncomeVsExpense } = buildIncomeVsExpense({
    userId,
    startDate,
    endDate,
  });

  const [
    summary,
    monthlySpending,
    categorySpending,
    IncomeSummary,
    IncomeCategories,
    IncomeVsExpenseSummary,
  ] = await Promise.all([
    expenseModel.aggregate(pipeline),
    expenseModel.aggregate(MonthlySpendingPipeline),
    expenseModel.aggregate(CategoriesSpendings),
    incomeModel.aggregate(IncomePipeline),
    incomeModel.aggregate(IncomeByCategories),
    incomeModel.aggregate(IncomeVsExpense),
  ]);
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
  const incomeSummary = IncomeSummary[0] || [];
  const incomeByCategories = IncomeCategories[0] || [];
  const incomeVsExpenseSummary = IncomeVsExpenseSummary || [];
  try {
    return NextResponse.json({
      success: true,
      data: {
        summary: summary[0],
        monthlyBreakDown,
        categoryBreakDown,
        incomeSummary,
        incomeByCategories,
        incomeVsExpenseSummary,
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

  const queryPipeline: any[] = [
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
  ];

  try {
    //change to createIndex when users become huge, also change the match
    const getRecentExpense = await expenseModel.aggregate(queryPipeline);
    const getRecentIncome = await incomeModel.aggregate(queryPipeline);
    // console.log("recent Expenses");
    // console.log(getRecentExpense);

    return NextResponse.json({
      success: true,
      data: getRecentExpense,
      recentIncome: getRecentIncome,
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
