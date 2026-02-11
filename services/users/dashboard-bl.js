import { User } from "../../models/auth/User.js";

export const dashboardBL = async (req, res) => {
  try {
    const data = await User.findOne({});

    // return data;

  } catch (error) {
    console.error("User Dashboard Error: ", error.message);
    throw error;
  }
};
