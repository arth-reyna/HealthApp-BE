import { User } from "../models/auth/User.js";
import { verifyToken } from "../utils/jwt.js";
import { badRequest } from "../utils/responseHandler.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("token from middleware: ", token);

    if (token) {
      const payload = await verifyToken(token);

      if (payload) {
        console.log("Payload: ", payload);
        req.user = payload;

        const role = await User.findOne({ payload });
        // console.log(role);

        next();
      } else {
        throw new Error("Not Authorized");
      }
    } else {
      return badRequest(res, "Token not present");
    }
  } catch (error) {
    console.error("Error during Middleware Auth: ", error.message);

    return badRequest(res, "Token not present");
  }
};
