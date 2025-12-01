import { NextResponse } from "next/server";
import { userModel } from "@/model/User";
import { connectDB } from "@/lib/db";
import bcrypt from "bcrypt";
import { generateRefreshToken, generateToken } from "@/lib/jwt";
export async function POST(request: Request) {
  await connectDB();
  try {
    const { email, password } = await request.json();

    const checkUser = await userModel
      .findOne({ email: email })
      .select("+password");
    if (!checkUser) {
      return NextResponse.json(
        {
          success: false,
          message: "No email is founded",
        },
        { status: 401 }
      );
    }
    const checkPw = await bcrypt.compare(password, checkUser.password);
    if (!checkPw) {
      return NextResponse.json(
        { message: "Password is not correct!", success: false },
        { status: 400 }
      );
    }
    //generating token
    const accessToken = generateToken({
      id: checkUser._id,
      email: checkUser.email,
      name: checkUser.username,
    });
    const refreshToken = generateRefreshToken({
      id: checkUser._id,
      email: checkUser.email,
      name: checkUser.username,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: checkUser._id,
        email: checkUser.email,
        name: checkUser.username,
      },
    });
    //tokens in cookie storage
    response.cookies.set({
      name: "token",
      value: accessToken,
      httpOnly: true,
      maxAge: 60 * 15,
    });
    response.cookies.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
