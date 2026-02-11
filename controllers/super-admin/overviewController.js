import { overviewBL } from "../../services/super-admin/overview-bl.js";
import { sendSuccess } from "../../utils/responseHandler.js";

export const overviewController = async (req, res, next) => {
  try {
    const dashboardData = await overviewBL();

    return sendSuccess(res, "Admin Dashboard", dashboardData);

  } catch (error) {
    console.error("overviewController Error: ", error.message);
    next(error);
    
  }
};
