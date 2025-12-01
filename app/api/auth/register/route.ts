import { NextResponse } from "next/server";
import { userModel } from "@/model/User";
import { connectDB } from "@/lib/db";
import bcrypt from "bcrypt";
export async function POST(request: Request) {
  await connectDB();
  try {
    const { name, email, password } = await request.json();

    const normalizeEmail = email.toLowerCase().trim();
    const existingUser = await userModel.findOne({ email: normalizeEmail });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "Email already Existed!",
      });
    }
    const hashPw = await bcrypt.hash(password, 10);
    const addNewUser = await userModel.create({
      username: name,
      email: normalizeEmail,
      password: hashPw,
    });
    await addNewUser.save();
    return NextResponse.json({
      success: true,
      user: {
        id: addNewUser._id,
        name: name,
        email: normalizeEmail,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
