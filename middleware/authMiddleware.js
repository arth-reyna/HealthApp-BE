import { User } from "../models/auth/User.js";
import { BaseUserModel } from "../module/user/user.model.js";
import { verifyToken } from "../utils/jwt.js";
import { badRequest } from "../utils/responseHandler.js";
import { AppError } from "../utils/AppError.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("token from middleware: ", token);

    if (token) {
      const payload = await verifyToken(token);

      if (payload) {
        console.log("Payload: ", payload);
        req.user = payload;

        const role = await BaseUserModel.findOne({ _id: payload.id });
        console.log("Middleware User: ", role);

        next();
      } else {
        throw new Error("Not Authorized");
      }
    } else {
      throw new AppError(404, "Token not present");
    }
  } catch (error) {
    console.error("Error during Middleware Auth: ", error.message);

    throw new AppError(404, "Token not present");
  }
};
