import { sendCreated, sendSuccess } from "../../utils/responseHandler.js";
import {
  createUserBL,
  deleteUserBL,
  editUserBL,
  allUsersBL,
} from "../../services/super-admin/users-bl.js";

export const createUserController = async (req, res, next) => {
  try {
    const user = await createUserBL(req, res);

    return sendCreated(res, "User created", user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const allUsers = async (req, res, next) => {
  try {
    const users = await allUsersBL();

    return sendSuccess(res, "Fetched all users", users);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const editController = async (req, res, next) => {
  try {
    const editUser = await editUserBL(req, res);

    return sendSuccess(res, "User updated successfully", editUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteController = async (req, res, next) => {
  try {
    const del = await deleteUserBL(req, res);

    return sendSuccess(res, "deleted successfully", del.email);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
