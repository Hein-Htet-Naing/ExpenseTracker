import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: "token",
    value: "",
    maxAge: 0,
    httpOnly: true,
  });
  response.cookies.set({
    name: "refreshToken",
    value: "",
    maxAge: 0,
    httpOnly: true,
  });
  return response;
}
