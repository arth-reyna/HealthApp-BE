import express from "express";
import { overviewController } from "../../controllers/super-admin/overviewController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { roleMiddleware } from "../../middleware/roleMiddleware.js";

const router = express.Router();

// Super Admin Routes
router.get("/overview", authMiddleware, roleMiddleware("superadmin"), overviewController);
// router.get('/users', authMiddleware, roleMiddleware("superadmin"), allUsers);

// router.get('/user/:id', getSpecificUserController);

export default router;
