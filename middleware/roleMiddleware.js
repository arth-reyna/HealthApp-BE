import { notAuthorized } from "../utils/responseHandler.js";

export const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    const { id, role } = req.user;
    console.log("role: ", role);

    if (!roles.includes(role)) {
      return notAuthorized(res, "Not authorized to access page");
    }
    next();
  };
};
