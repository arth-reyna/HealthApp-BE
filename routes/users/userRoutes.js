import express from "express";
import { dashboard } from "../../controllers/users/dashboard.js";

const router = express.Router();

//User Routes
router.get("/dashboard", dashboard);

export default router;
