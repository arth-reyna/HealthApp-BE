import {
  badRequest,
  castError,
  notFound,
  sendSuccess,
} from "../../utils/responseHandler.js";
import { BaseUserModel } from "./user.model.js";
import { logger } from "../../utils/logger.js";
import {
  create,
  deleteOne,
  find,
  findOne,
  updateOne,
} from "../../utils/dbQueryHelper.js";
import { HashPassword, comparePassword } from "../../utils/password.hash.js";
import { deleteJwtToken, generateToken } from "../../utils/jwt.js";
import mongoose from "mongoose";
import { loginSchema } from "../../validation-schemas/user/loginSchema.js";
import { AppError } from "../../utils/AppError.js";

export const createUserBL = async (data, role) => {
  try {
    const emailValidate = await findOne({
      model: BaseUserModel,
      filter: { email: data.email },
    });

    //Check if Email ALready Exists
    if (emailValidate) {
      logger.warn({
        message: "email already exists",
        event: "REGISTER",
        reason: "SAME_EMAIL",
        location: "CreateUserBL",
      });
      throw new AppError(400, "email already exists");
    }

    //Hash Password
    const hashPassword = await HashPassword(data.password);

    //Update Dynamic values bfor storing in DB
    data.password = hashPassword;
    data.role = role;
    const user = await create({
      model: BaseUserModel,
      data: data,
    });

    logger.log({
      level: "info",
      label: "SUPERADMIN",
      message: `created ${role}`,
      event: "REGISTER",
      role: `${role}`,
    });

    logger.info({
      label: "REGISTER",
      message: "reached create user bl",
    });

    return user;
  } catch (error) {
    logger.info({
      label: "REGISTER",
      message: "recorded error in register bl",
    });
    throw error;
  }
};

export const loginUserBL = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      logger.warn({
        message: "email or password not entered",
        event: "LOGIN",
        location: "CreateUserBL",
      });

      throw new AppError(404, "details not found");
    }

    const { email, password } = value;
    console.log(email, password, "adasasd");

    // Find by email
    const user = await findOne({
      model: BaseUserModel,
      filter: { email: value.email },
    });

    if (!user) {
      logger.warn({
        message: "user not found",
        event: "LOGIN",
        location: "CreateUserBL",
      });

      throw new AppError(404, "User not found!");
    }

    //Compare Password
    await comparePassword(value.password, user.password, res);

    // Generate Token
    const token = await generateToken(user._id, user.role, res);

    logger.info({
      event: "LOGIN",
      message: `user ${email} login successful`,
      label: `${user.role}`,
      meta: email,
    });

    return {
      token: token,
      role: user.role,
    };
  } catch (error) {
    logger.warn({
      level: "error",
      message: "error during login",
      event: "LOGIN",
    });

    logger.info({
      label: "LOGIN",
      message: "recorded error in login bl",
    });

    throw error;
  }
};

//Logout
export const logoutUserBL = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) throw new AppError(404, "Token not found");

    await deleteJwtToken(res);

    return sendSuccess(res, "Logged out successfully");
  } catch (error) {
    logger.info({
      label: "LOGOUT",
      message: "recorded error in logout bl",
    });
    throw error;
  }
};

//Update
export const updateUserBL = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) throw new AppError(404, "No ID found");

    //Check if user exists or not
    const user = await findOne({
      model: BaseUserModel,
      filter: { _id: id },
    });

    if (!user) throw new AppError(404, "user not found");

    //get data for update
    const { password, ...otherData } = req.body;
    const updateData = { ...otherData };

    updateData.password = await HashPassword(password);

    //Update other details
    const update = await updateOne({
      model: BaseUserModel,
      filter: { _id: id },
      update: updateData,
    });

    logger.log({
      level: "info",
      label: "SUPERADMIN",
      message: `updated user: ${user.email}`,
      event: "UPDATE",
    });

    return update;
  } catch (error) {
    logger.info({
      label: "UPDATE",
      message: "recorded error in update bl",
    });
    throw error;
  }
};

//Delete User [Hard delete]
export const deleteUserBL = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id || id == null) throw new AppError(404, "id not found");

    const del = await deleteOne({
      model: BaseUserModel,
      filter: { _id: id },
    });

    return del;
  } catch (error) {
    logger.info({
      label: "DELETE",
      message: "recorded error in delete bl",
    });
    throw error;
  }
};

//  active User [Soft delete]
export const inActiveUserBL = async (req, res) => {
  try {
    const id = req.params.id;

    //Check if entered or valid
    if (!id || id == null) throw new AppError(404, "ID not found");

    if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError(400, "invalid object id");

    const toggle = await BaseUserModel.updateOne(
      { _id: id },
      [
        {
          $set: {
            isActive: { $not: "$isActive" },
          },
        },
      ],
      {
        updatePipeline: true,
      },
    );

    if (!toggle) throw new AppError(400, "Error during toggling");

    return toggle;
  } catch (error) {
    logger.info({
      label: "TOGGLE",
      message: "recorded error in toggle bl",
    });
    throw error;
  }
};

export const getAllUsersBL = async (req, res, role) => {
  try {
    console.log("Role from GET: ", role);

    const users = await find({
      model: BaseUserModel,
      filter: { role: role },
    });

    console.log("Users: ", users);

    return users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      active: user.isActive,
      joined: user.createdAt,
    }));
  } catch (error) {
    logger.info({
      label: "GET",
      message: "recorded error in getalluser bl",
    });
    throw error;
  }
};
