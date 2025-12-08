import mongoose from "mongoose";

interface queryProps {
  userId: string;
  search: string;
  categoryId: string;
}

export function builFilterIcomePipeline({
  userId,
  search,
  categoryId,
}: queryProps) {
  const match: any = {
    userId: new mongoose.Types.ObjectId(userId),
  };
}
