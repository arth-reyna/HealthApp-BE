import express from "express";
import superadminRoutes from "./dashboard.js";
import userManagementRoutes from "./user-managementRoutes.js";

const router = express.Router();

//Till Route: /api/admin/

//User Routes
router.use("/dashboard", superadminRoutes);
router.use("/user-management", userManagementRoutes);

export default router;
