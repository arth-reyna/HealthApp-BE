import resetPassword from "../../services/auth/reset-pass-bl.js";
import { sendSuccess } from "../../utils/responseHandler.js";

const resetController = async (req, res, next) => {
  try {
    const reset = await resetPassword(req, res);

    return sendSuccess(res, "Password reset successful");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default resetController;
