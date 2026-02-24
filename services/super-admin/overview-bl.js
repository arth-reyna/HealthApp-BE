import { User, BaseUserModel } from "../../models/auth/User.js";
import { logger } from "../../utils/logger.js";

export const overviewBL = async () => {
  try {
    const allData = await BaseUserModel.aggregate([
      {
        $facet: {
          activeUsers: [
            {
              $match: {
                isActive: true,
              },
            },
            {
              $count: "activeUsers",
            },
          ],

          inActiveUsers: [
            {
              $match: {
                isActive: false,
              },
            },
            {
              $count: "inActiveUsers",
            },
          ],

          totalUsers: [
            {
              $match: {
                role: "user",
              },
            },
            {
              $count: "totalUsers",
            },
          ],

          totalAdmins: [
            {
              $match: {
                role: "admin",
              },
            },
            {
              $count: "totalAdmins",
            },
          ],
        },
      },
    ]);

    const [activeUsers, inActiveUsers, totalAdmins, totalUsers] = [
      allData?.[0]?.activeUsers[0]?.activeUsers ?? 0,
      allData?.[0]?.inActiveUsers[0]?.inActiveUsers ?? 0,
      allData?.[0]?.totalAdmins[0]?.totalAdmins ?? 0,
      allData?.[0]?.totalUsers[0]?.totalUsers ?? 0,
    ];

    logger.log({
      level: "info",
      message: "fetched superadmin dashboard",
      label: "SUPERADMIN",
      event: "GET",
    });

    return {
      activeUsers: activeUsers,
      inActiveUsers: inActiveUsers,
      totalAdmins: totalAdmins,
      totalUsers: totalUsers,
    };
  } catch (error) {
    console.error("Overview BL Error: ", error);
    throw error;
  }
};
