import { fetchUserValidation, userValidation } from "./user.validation.js";
import {
  createUserBL,
  loginUserBL,
  logoutUserBL,
  updateUserBL,
  deleteUserBL,
  inActiveUserBL,
  getAllUsersBL,
} from "./user.services.js";
import {
  badRequest,
  notFound,
  sendCreated,
  sendSuccess,
} from "../../utils/responseHandler.js";
import { logger } from "../../utils/logger.js";
import { AppError } from "../../utils/AppError.js"

// Create
export const createUserController = async (req, res, next) => {
  try {
    const role = req.params.role;
    console.log("Role from Param: ", role);

    const data = req.body;
    console.log("Data : ", data);

    const user = await createUserBL(data, role);
    if (user) return sendCreated(res, `${role} created`, user);
  } catch (error) {
    next(error);
  }
};

//Login
export const loginUserController = async (req, res, next) => {
  try {
    const user = await loginUserBL(req, res);
    if (!user) throw new AppError(400, "Error during login");

    logger.info({
      label: "LOGIN",
      message: "reached login controller",
    });
    return sendSuccess(res, `login success`, user);
  } catch (error) {
    logger.info({
      label: "LOGIN",
      message: "fetched error in login controller",
    });
    next(error);
  }
};

//Logout
export const logoutUserController = async (req, res, next) => {
  try {
    const logout = await logoutUserBL(req, res);

    if (!logout) throw new AppError(400, "Error during logout");

    logger.info({
      label: "LOGOUT",
      message: "reached logout controller",
    });
    return sendSuccess(res, "Logged out successfully");
  } catch (error) {
    logger.info({
      label: "LOGOUT",
      message: "fetched error in logout controller",
    });
    next(error);
  }
};

//Update
export const updateUserController = async (req, res, next) => {
  try {
    const update = await updateUserBL(req, res);

    if (!update) throw new AppError(400, "Error during update");

    logger.info({
      label: "UPDATE",
      message: "reached update controller",
    });

    return sendSuccess(res, "updated successfully");
  } catch (error) {
    logger.info({
      label: "UPDATE",
      message: "fetched error in update controller",
    });
    next(error);
  }
};

//Delete
export const deleteUserController = async (req, res, next) => {
  try {
    const del = await deleteUserBL(req, res);

    if (!del) throw new AppError(400, "Error deleting user");

    logger.info({
      label: "DELETE",
      message: "reached delete controller",
    });

    return sendSuccess(res, "deleted successfully");
  } catch (error) {
    logger.info({
      label: "DELETE",
      message: "fetced error in delete controller",
    });
    next(error);
  }
};

// Toggle Status [Active]
export const toggleStatusController = async (req, res, next) => {
  try {
    const toggle = await inActiveUserBL(req, res);

    if (!toggle) throw new AppError(404, "Error toggling status");

    logger.info({
      label: "TOGGLE",
      message: "reached toggle controller",
    });

    return sendSuccess(res, "toggled status successfully");
  } catch (error) {
    logger.info({
      label: "TOGGLE",
      message: "fetched error in toggle controller",
    });
    next(error);
  }
};

// Get Users
export const getAllUsersController = async (req, res, next) => {
  try {
    const role = req.params.role;

    const validate = await fetchUserValidation(res, role);

    if (validate) {
      const users = await getAllUsersBL(req, res, role);

      if (!users) throw new AppError(404, "user not found");

      logger.info({
        label: "GET",
        message: "reached get controller",
      });

      return sendSuccess(res, `fetched all ${role}`, users);
    }
  } catch (error) {
    logger.info({
      label: "GET",
      message: "fetched error in get controller",
    });
    next(error);
  }
};
