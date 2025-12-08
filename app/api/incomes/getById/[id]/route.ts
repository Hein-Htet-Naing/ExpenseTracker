import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { incomeModel } from "@/model/Income";
import mongoose from "mongoose";
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid Income!",
      },
      { status: 400 }
    );
  }

  try {
    const getIncomebyId = await incomeModel.findById(id);
    // console.log("Income from " + getIncomebyId);
    if (!getIncomebyId) {
      return NextResponse.json(
        {
          success: false,
          message: "No Category Exists!",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json({
      success: true,
      data: getIncomebyId,
    });
  } catch (error: any) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error!",
      },
      {
        status: 500,
      }
    );
  }
}
