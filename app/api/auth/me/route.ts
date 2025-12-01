import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
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
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided", status: 401 }
        // { status: 401 }
      );
    }
    // console.log("JWT_SECRET:", process.env.JWT_SECRET_KEY);
    // console.log("Token:", token);

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      user: decoded,
    });
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
