import mongoose from "mongoose";
import { User } from "./auth/User.js";
import { BaseUserModel } from "../module/user/user.model.js";
import { HashPassword } from "../utils/password.hash.js";

const MONGO_URI =
  "mongodb+srv://arthvala:arthvala@arth.hlm8srg.mongodb.net/HealthApp?appName=Arth";

const createUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const hashPassword = await HashPassword("Arth@123")

    await BaseUserModel.insertMany([
      {
        email: "arth@reyna.com",
        password: hashPassword,
        role: "superadmin",
        isActive: true,
      },
    ]);

    console.log("✅ user added successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

createUsers();
