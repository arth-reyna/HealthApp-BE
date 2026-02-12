import express from "express";
import { loginUser, logoutController, register, resetController, forgotPassword} from "../../controllers/auth/authController.js";

const router = express.Router();

// till route: /api/auth/<>

// Auth Routes
router.post("/register", register);
router.post("/login", loginUser);
router.post("/logout", logoutController);
router.post("/reset", forgotPassword);
router.post("/reset/:id/:token", resetController);

export default router;
