import express from "express";
import superadminRoutes from "./dashboard.js";
import userModuleRoutes from "../../module/user/user.route.js";
// import userManagementRoutes from "./user-managementRoutes.js";

const router = express.Router();

//User Routes
router.use("/dashboard", superadminRoutes);
router.use("/user-management", userModuleRoutes);
// router.use("/user-management", userManagementRoutes);
export default router;
