import { CategoriesModel } from "@/model/Categories";
import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
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
        message: "Invalid CategoryId",
      },
      { status: 400 }
    );
  }

  try {
    const getCategorybyId = await CategoriesModel.findById(id);
    console.log("Categoreis from " + getCategorybyId);
    if (!getCategorybyId) {
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
      data: getCategorybyId,
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
