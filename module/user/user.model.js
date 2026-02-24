import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin", "superadmin"],
      default: "student",
      index: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    passwordToken: {
      type: String,
    },
    passwordExpires: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const BaseUserModel = mongoose.model("all_users", userSchema);
