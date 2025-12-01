import { generateToken, verifyRefreshToken } from "@/lib/jwt";

import { NextResponse } from "next/server";
export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");

    if (!cookieHeader) {
      return NextResponse.json(
        {
          success: false,
          message: "No cookie Found",
        },
        { status: 401 }
      );
    }
    const refreshToken = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("refreshToken="))
      ?.split("=")[1];

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "No refresh Token" },
        { status: 403 }
      );
    }
    const decoded = verifyRefreshToken(refreshToken);
    // console.log(decoded);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid refresh Token" },
        { status: 403 }
      );
    }
    const { exp, iat, ...cleanJwtPaylaod } = decoded;
    // console.log("New Access Token:", cleanJwtPaylaod);
    const newAccessToken = generateToken(cleanJwtPaylaod);

    // console.log("New Access Token:", newAccessToken);
    const response = NextResponse.json({
      success: true,
    });
    response.cookies.set({
      name: "token",
      value: newAccessToken,
      httpOnly: true,
      maxAge: 60 * 15,
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
