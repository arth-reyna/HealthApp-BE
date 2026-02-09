import mongoose from "mongoose";
import { User } from "./auth/User.js";

const MONGO_URI = "mongodb://localhost:27017/HealthApp";

const createUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    await User.insertMany([
      {
        email: "admin2@reyna.com",
        password: "Abc@12345",
        role: "superadmin",
        isActive: true,
      },
      
    ]);

    console.log("✅ All users added successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

createUsers();
