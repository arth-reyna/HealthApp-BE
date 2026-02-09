import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "teacher", "admin", "superadmin"],
      default: "user",
      index: true
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
