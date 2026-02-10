import { User } from "../../models/auth/User.js";

export const overviewBL = async () => {
  try {
    const [totalUsers, totalAdmins, activeUsers, inActiveUsers] =
      await Promise.all([
        User.countDocuments({ role: "user" }),
        User.countDocuments({ role: "admin" }),
        User.countDocuments({ isActive: true }),
        User.countDocuments({ isActive: false }),
      ]);

    return {
      totalUsers: totalUsers,
      totalAdmins: totalAdmins,
      activeUsers: activeUsers,
      inActiveUsers: inActiveUsers,
    };
  } catch (error) {
    console.error("Overview BL Error: ", error.message);
  }
};
