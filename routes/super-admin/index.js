import express from "express";
import superadminRoutes from './dashboard.js'

const router = express.Router();

//Till Route: /api/admin/

//User Routes
router.use("/dashboard", superadminRoutes);

export default router;