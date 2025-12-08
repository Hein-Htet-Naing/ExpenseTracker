import mongoose, { Schema, Document, Types } from "mongoose";

interface IIncome extends Document {
  title: string;
  amount: number;
  categoryId: Types.ObjectId;
  source?: string;
  date: Date;
  description?: string;
  userId: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
const incomeSchema = new Schema<IIncome>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxLength: [150, "Title cannot be more than 100 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    source: {
      type: String,
      trim: true,
      maxlength: [100, "Source cannot exceed 100 characters"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot be more than 500 characters"],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Category is required"],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const incomeModel =
  mongoose.models.Income || mongoose.model<IIncome>("Income", incomeSchema);
