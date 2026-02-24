import { AppError } from "../utils/AppError.js";

export const globalErrorHandler = async (err, req, res, next) => {
  try {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  } catch (error) {
    console.error(error);
  }
};
