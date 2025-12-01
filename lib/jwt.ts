import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
export interface jwtPayLoad {
  id: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}
const JWT_KEY = process.env.JWT_SECRET_KEY;
const JWT_REFRESH_KEY = process.env.JWT_REFRESH_SECRET_KEY;
export const generateToken = (payload: jwtPayLoad) => {
  return jwt.sign(payload, JWT_KEY!, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: jwtPayLoad) => {
  return jwt.sign(payload, JWT_REFRESH_KEY!, { expiresIn: "7d" });
};

export const verifyToken = (token: string): jwtPayLoad | null => {
  try {
    return jwt.verify(token, JWT_KEY!) as jwtPayLoad;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): jwtPayLoad | null => {
  try {
    return jwt.verify(token, JWT_REFRESH_KEY!) as jwtPayLoad;
  } catch (error) {
    return null;
  }
};
