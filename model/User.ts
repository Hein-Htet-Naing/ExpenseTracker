import mongoose, { Schema, Document } from "mongoose";
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}
const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    maxLength: [50, "Name cannot be more than 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
});

export const userModel =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
