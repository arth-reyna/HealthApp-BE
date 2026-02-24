import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { roleMiddleware } from "../../middleware/roleMiddleware.js";
import {
  createUserController,
  deleteUserController,
  updateUserController,
  toggleStatusController,
  getAllUsersController,
} from "./user.controller.js";
import { validateByRole } from "../../middleware/joiMiddleware.js";

const router = express.Router();
const role = "superadmin";

router.post(
  "/:role",
  authMiddleware,
  roleMiddleware(role),
  validateByRole,
  createUserController,
);
router.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware(role),
  updateUserController,
);
router.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware(role),
  deleteUserController,
);

router.post(
  "/toggle/:id",
  authMiddleware,
  roleMiddleware(role),
  toggleStatusController,
);

router.get(
  "/:role",
  authMiddleware,
  roleMiddleware(role),
  getAllUsersController,
);

export default router;
