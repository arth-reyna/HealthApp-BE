import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("token from middleware: ", token);

    if (token) {
      const payload = verifyToken(token);

      if (payload) {
        console.log("Payload: ", payload);
        req.user = payload;

        next();
      } else {
        throw new Error("Not Authorized");
      }
    }
  } catch (error) {
    console.error("Error during Middleware Auth: ", error.message);
  }
};
