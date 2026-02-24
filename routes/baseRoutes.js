import express from "express";
import authRoutes from "./auth/authRoutes.js";
import userRoutes from "./users/userRoutes.js";
import superadminRoutes from "./super-admin/index.js";

const router = express.Router();

//Auth ROute
router.use("/auth", authRoutes);

//User Route
router.use("/user", userRoutes);

//Super Admin Route
router.use("/superadmin", superadminRoutes);

export default router;
