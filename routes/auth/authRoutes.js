import express from "express";
import {
  loginUser,
  logoutController,
  register,
  resetController,
  forgotPassword,
} from "../../controllers/auth/authController.js";
import {
  loginUserController,
  logoutUserController,
} from "../../module/user/user.controller.js";

const router = express.Router();

// router.post("/register", register);
router.post("/login", loginUserController);
router.post("/logout", logoutUserController);
router.post("/reset", forgotPassword);
router.post("/reset/:id/:token", resetController);

export default router;
