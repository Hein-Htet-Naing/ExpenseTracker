import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { CategoriesModel } from "@/model/Categories";
import mongoose from "mongoose";
import { validateCategoreis } from "@/lib/validation";
export async function GET() {
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
  try {
    const expenseCategories = await CategoriesModel.find({
      userId,
      types: "expense",
      deletedAt: null,
    });
    const incomeCategories = await CategoriesModel.find({
      userId,
      types: "income",
      deletedAt: null,
    });
    const categories = await CategoriesModel.find({
      userId,
      deletedAt: null,
    });
    return NextResponse.json({
      success: true,
      data: { categories, expenseCategories, incomeCategories },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
// await CategoriesModel.updateMany(
//   {
//     deletedAt: { $exists: false },
//   },
//   {
//     $set: { deletedAt: null },
//   }
// );
//  const update = await CategoriesModel.updateMany(
//     {},
//     { $set: { types: "expense" } }
//   );
export async function POST(request: Request) {
  try {
    // Connect to DB with error handling
    await connectDB();
  } catch (dbError) {
    console.error("DB connection failed:", dbError);
    return NextResponse.json(
      { success: false, message: "Database connection error" },
      { status: 500 }
    );
  }
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
  const { name, description, color, types } = await request.json();
  const normalizedCategoryName = name.toLowerCase().trim();
  //before adding validate the data
  //added later here
  const validateData = validateCategoreis({ name, color, types, description });
  if (Object.keys(validateData).length > 0) {
    return NextResponse.json({
      success: false,
      message: "Invalid Data!",
    });
  }

  //add New Category
  try {
    const res = await CategoriesModel.create({
      name: normalizedCategoryName,
      description: description,
      color: color,
      types: types,
      userId: mongoose.Types.ObjectId.createFromHexString(userId!),
    });
    console.log(res);
    return NextResponse.json({
      success: true,
      message: "New Category Added Successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
