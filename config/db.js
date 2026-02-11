import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
console.log(MONGO_URI);

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected sucessfuly.");
  } catch (error) {
    console.log("Database Connection Error: ", error);
  }
};

export default dbConnect;
