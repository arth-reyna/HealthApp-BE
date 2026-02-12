import { User } from "../../models/auth/User.js";

export const overviewBL = async () => {
  try {
    // const [totalUsers, totalAdmins, activeUsers, inActiveUsers] =
    //   await Promise.all([
    //     User.countDocuments({ role: "user" }),
    //     User.countDocuments({ role: "admin" }),
    //     User.countDocuments({ isActive: true }),
    //     User.countDocuments({ isActive: false }),
    //   ]);

    //   // await aggregate()
    // return {
    //   totalUsers: totalUsers,
    //   totalAdmins: totalAdmins,
    //   activeUsers: activeUsers,
    //   inActiveUsers: inActiveUsers,
    // };

    // Testing Aggregation Query
    const allData = await User.aggregate([
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
