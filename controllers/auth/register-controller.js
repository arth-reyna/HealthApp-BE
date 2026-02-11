import userRegisterBL from "../../services/auth/register-bl.js";
import { internalServerError, sendCreated } from "../../utils/responseHandler.js";

const register = async (req, res, next) => {
  try {
    const result = await userRegisterBL(req, res);

    return sendCreated(res, "User created successfully", result);

  } catch (error) {
    console.log(error);
    next(error);
    
  }
};

export default register;
