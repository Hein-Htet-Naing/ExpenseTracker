import { expenseModel } from "@/model/Expenses";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { buildExpenseQueryAndPipeline } from "@/helper/queryHelper";
export async function POST(request: NextRequest) {
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

  const { pipeline, MonthlySpendingPipeline } = buildExpenseQueryAndPipeline({
    userId,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    categoryIds,
  });

  const [summary, monthlySpending] = await Promise.all([
    expenseModel.aggregate(pipeline),
    expenseModel.aggregate(MonthlySpendingPipeline),
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

  const monthlyBreakDown = monthlySpending[0].monthlyBreakdown || [];
  try {
    return NextResponse.json({
      success: true,
      data: { summary: summary[0], monthlyBreakDown },
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
