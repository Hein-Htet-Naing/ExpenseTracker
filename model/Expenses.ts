import mongoose, { Schema, Document, Types } from "mongoose";

interface IExpense extends Document {
  title: string;
  amount: number;
  categoryId: Types.ObjectId;
  description?: string;
  date: Date;
  userId: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}

const expenseSchema = new Schema<IExpense>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot be more than 500 characters"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
export const expenseModel =
  mongoose.models.Expenses ||
  mongoose.model<IExpense>("Expenses", expenseSchema);
