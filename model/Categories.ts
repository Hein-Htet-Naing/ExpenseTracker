import mongoose, { Schema, Document, Types } from "mongoose";

interface ICategories extends Document {
  name: string;
  description?: string;
  color: string;
  userId: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
const categoriesSchema = new Schema<ICategories>({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxLength: [100, "Name cannot be more than 100 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, "Description cannot be more than 500 characters"],
  },
  color: {
    type: String,
    required: [true, "Color is required"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});
export const CategoriesModel =
  mongoose.models.Category ||
  mongoose.model<ICategories>("Category", categoriesSchema);
