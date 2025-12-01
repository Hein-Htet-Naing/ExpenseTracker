import moongoose from "mongoose";
const MONGO_URL = process.env.MONGODB_URL as string;
if (!MONGO_URL) {
  throw new Error("define the MONGODB_URL environment variable");
}
let isConnected = false;
export async function connectDB() {
  if (isConnected) {
    return;
  }
  try {
    await moongoose.connect(MONGO_URL);
    isConnected = true;
  } catch (error: any) {
    console.error("DB connection error:", error.message);
  }
}
