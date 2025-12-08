import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { incomeModel } from "@/model/Income";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { IncomeFormData } from "@/types/income";

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
  //use change stream for extreme scale
  //testing tool like artillery
  //reduce network overhead and for high traffic app, use partial updates
  const updateData: IncomeFormData = await request.json();
  const updateFields: Record<string, any> = {};
  const fieldToValidate: Partial<IncomeFormData> = {};

  const allowedFileds = [
    "title",
    "amount",
    "categoryId",
    "source",
    "date",
    "description",
  ];
  for (const [key, value] of Object.entries(updateData)) {
    if (allowedFileds.includes(key)) {
      if (key === "categoryId" && value && typeof value === "string") {
        // Convert categoryId to ObjectId if provided
        updateFields[key] = mongoose.Types.ObjectId.createFromHexString(value);
      } else if (key === "amount") {
        updateFields[key] = Number(value);
      } else {
        updateFields[key] = value;
      }
      fieldToValidate[key as keyof IncomeFormData] = value;
    }
  }

  updateFields.updatedAt = new Date();
  const updateIncome = await incomeModel.updateOne(
    {
      _id: id,
      userId: mongoose.Types.ObjectId.createFromHexString(userId!),
    },
    {
      $set: updateFields,
    }
  );
  if (updateIncome.matchedCount === 0) {
    return NextResponse.json(
      { success: false, message: "Income not found or not owned by user" },
      { status: 404 }
    );
  }

  console.log("update income" + updateIncome);
  if (updateIncome.matchedCount === 0) {
    return NextResponse.json(
      { success: false, message: "Income not found or not owned by user" },
      { status: 404 }
    );
  }
  return NextResponse.json({
    success: true,
    message: "Income Updated Successfully!",
  });
}

export async function DELETE(
  requet: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  connectDB();
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
    const updateDeletedAt = await incomeModel.updateOne(
      {
        _id: id,
        userId: mongoose.Types.ObjectId.createFromHexString(userId!),
        deletedAt: null,
      },
      {
        $set: { deletedAt: new Date() },
      }
    );
    if (updateDeletedAt.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Income not found, not owned by user, or already deleted",
        },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Income soft-deleted successfully!",
    });
  } catch (error: any) {
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
