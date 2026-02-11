import express from "express";
import userRegister from "../../controllers/auth/register-controller.js";
import userLogin from "../../controllers/auth/login-controller.js";
import logoutController  from "../../controllers/auth/logout-controller.js";
import forgotPassword  from "../../controllers/utils/forgot-controller.js";
import resetController from "../../controllers/utils/reset-controller.js";


const router = express.Router();

// till route: /api/auth/<>

// Auth Routes
router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/logout", logoutController);
router.post("/reset", forgotPassword);
router.post("/reset/:id/:token", resetController);

export default router;
