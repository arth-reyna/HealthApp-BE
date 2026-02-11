import userLoginBL from "../../services/auth/login-bl.js";
import { sendSuccess } from "../../utils/responseHandler.js";

const loginUser = async (req, res, next) => {
  try {
    const result = await userLoginBL(req, res);

    return sendSuccess(res, "User logged in successfully", result)
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default loginUser;
