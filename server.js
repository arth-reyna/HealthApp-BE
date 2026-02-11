//Importing Libraries
import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import baseRoutes from "./routes/baseRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 5001;

// Initialize Server
const app = express();

const allowedOrigins = "http://localhost:5173/";

// const corsOption = {
//   origin: ["http://localhost:5173/","http://localhost:5001/api/auth/login", "http://localhost:3000"],
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }

app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);

// app.use(cors(corsOption));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Base Route
app.use("/api", baseRoutes);

//Server Connection
const startServerAndDatabase = async () => {
  try {
    app.listen(PORT, () => {
      dbConnect();
      console.log(`Server is live on port ${PORT}`);
    });
  } catch (error) {
    console.log("Server Error: ", error);
  }
};

startServerAndDatabase();
