import bcrypt from "bcryptjs";
import { logger } from "./logger.js";
import { AppError } from "./AppError.js";


export const HashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    return hashPassword;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const comparePassword = async (password1, password2) => {
  try {
    const isValidPassword = await bcrypt.compare(password1, password2);

    if (!isValidPassword) {
      logger.warn({
        level: "error",
        message: "incorrect credentials",
        event: "LOGIN"
      });

      throw new AppError(400, "Incorrect credentials");
    }

    return isValidPassword;
    
  } catch (error) {
    throw error;
  }
};
