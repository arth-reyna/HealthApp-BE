import { User } from "../models/auth/User.js";
import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.signedCookies.token;
    console.log("token from middleware: ", token);

    if (token) {
      const payload = verifyToken(token);

      if (payload) {
        console.log("Payload: ", payload);
        req.user = payload;

        const role = User.findOne({ payload });
        // console.log(role);

        next();
      } else {
        throw new Error("Not Authorized");
      }
    } else {
      return res.status(400).json({
        code: 400,
        message: "Tokken not present",
        sucess: false,
      });
    }
  } catch (error) {
    console.error("Error during Middleware Auth: ", error.message);

    return res.status(400).json({
      code: 400,
      message: "Tokken not present",
      sucess: false,
    });
  }
};
