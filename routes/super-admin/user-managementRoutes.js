import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { roleMiddleware } from "../../middleware/roleMiddleware.js";
import {
  allUsers,
  createUserController,
  deleteController,
  editController,
} from "../../controllers/super-admin/userController.js";

const router = express.Router();

// User
router.get("/user", authMiddleware, roleMiddleware("superadmin"), allUsers);
router.post(
  "/user",
  authMiddleware,
  roleMiddleware("superadmin"),
  createUserController,
);
router.put(
  "/user/:id",
  authMiddleware,
  roleMiddleware("superadmin"),
  editController,
);
router.delete(
  "/user/:id",
  authMiddleware,
  roleMiddleware("superadmin"),
  deleteController,
);

//Admin
// router.post("/admin", authMiddleware, roleMiddleware(role), createAdminController);

//Teacher
// router.post("/teacher", authMiddleware, roleMiddleware(role), createUserController);

export default router;
