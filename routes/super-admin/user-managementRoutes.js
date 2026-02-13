import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { roleMiddleware } from "../../middleware/roleMiddleware.js";
import {
  allUsers,
  createUserController,
  deleteController,
  editController,
} from "../../controllers/super-admin/userController.js";
import {
  createAdminController,
  editAdminController,
  deleteAdminController,
  getAdminController,
} from "../../controllers/super-admin/adminController.js";

const role = "superadmin";
const router = express.Router();

// User
router.get("/user", authMiddleware, roleMiddleware(role), allUsers);
router.post(
  "/user",
  authMiddleware,
  roleMiddleware(role),
  createUserController,
);
router.put("/user/:id", authMiddleware, roleMiddleware(role), editController);
router.delete(
  "/user/:id",
  authMiddleware,
  roleMiddleware(role),
  deleteController,
);

//Admin
router.post(
  "/admin",
  authMiddleware,
  roleMiddleware(role),
  createAdminController,
);
router.put(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(role),
  editAdminController,
);
router.delete(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(role),
  deleteAdminController,
);
router.get("/admin", authMiddleware, roleMiddleware(role), getAdminController);

//Teacher
// router.post("/teacher", authMiddleware, roleMiddleware(role), createUserController);

export default router;
