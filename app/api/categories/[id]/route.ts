import { CategoriesModel } from "@/model/Categories";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
export async function PUT(
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
  const { name, color, description, types } = await request.json();

  try {
    await CategoriesModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          name: name,
          color: color,
          description: description,
          types: types,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
    return NextResponse.json({
      success: true,
      message: "Category Updated Successfully",
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

export async function DELETE(
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

  const result = await CategoriesModel.updateOne(
    { _id: id, deletedAt: null },
    {
      $set: { deletedAt: new Date() },
    }
  );
  console.log(result);
  if (result.matchedCount === 0) {
    return NextResponse.json(
      {
        success: false,
        message: "Category not found or already deleted",
      },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Category is deleted successfully",
  });
}
