import { sendForgetPassMail } from "../../services/utils/send-email-bl.js";
import { sendSuccess } from "../../utils/responseHandler.js";

const forgotPassword = async (req, res, next) => {
  try {
    const forgotPassCall = await sendForgetPassMail(req, res);

    return sendSuccess(res, "Mail sent successfully", forgotPassCall);
    
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default forgotPassword;
