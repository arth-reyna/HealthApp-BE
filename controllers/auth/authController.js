import { sendSuccess, sendCreated } from "../../utils/responseHandler.js";
import { sendForgetPassMail } from "../../services/utils/send-email-bl.js";
import {logoutBL, resetPasswordBL, userLoginBL, userRegisterBL } from "../../services/auth/auth-bl.js";


export const loginUser = async (req, res, next) => {
  try {
    const result = await userLoginBL(req, res);

    return sendSuccess(res, "User logged in successfully", result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const logoutConn = await logoutBL(req, res);

    return sendSuccess(res, "Logged out successfully", logoutConn);
  } catch (error) {
    console.error("Error during logout");
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const result = await userRegisterBL(req, res);

    return sendCreated(res, "User created successfully", result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const resetController = async (req, res, next) => {
  try {
    const reset = await resetPasswordBL(req, res);

    return sendSuccess(res, "Password reset successful");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const forgotPassCall = await sendForgetPassMail(req, res);

    return sendSuccess(res, "Mail sent successfully", forgotPassCall);
    
  } catch (error) {
    console.error(error);
    next(error);
  }
};