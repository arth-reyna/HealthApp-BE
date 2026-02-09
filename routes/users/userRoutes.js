import express from "express";
import { dashboard } from "../../controllers/users/user-dashboard.js";

const router = express.Router();

//Till Route: /api/user/

//User Routes
router.get("/dashboard", dashboard);

export default router;
