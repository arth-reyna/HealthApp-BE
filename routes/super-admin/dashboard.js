import express from "express";
import { overviewController } from "../../controllers/super-admin/overviewController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { roleMiddleware } from "../../middleware/roleMiddleware.js";

const router = express.Router();

// All Super Admin Routes
router.get("/overview", authMiddleware, roleMiddleware("superadmin"), overviewController);
// router.post('/create-user', createUserController);
// router.post('/create-admin', createAdminController);
// router.get('/users', getUsersController);
// router.get('/user/:id', getSpecificUserController);

export default router;
