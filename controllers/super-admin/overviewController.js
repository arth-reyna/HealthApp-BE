import { overviewBL } from "../../services/super-admin/overview-bl.js";

export const overviewController = async (req, res) => {
  try {
    const getOverview = await overviewBL();

    return res.status(200).json({
      code: 200,
      totalUsers: getOverview,
    });
  } catch (error) {
    console.error("overviewController Error: ", error.message);

    return res.status(400).json({
      code: 400,
      message: "Error getting data.",
    });
  }
};
