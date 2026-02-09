import { User } from "../../models/auth/User.js"

export const dashboardBL = async (req, res) => {
    try {
        const data = await User.findOne({});

        return res.status(200).json({
            code: 200,
            message: "User Dashboard",
            sucess: true
        })
        
    } catch (error) {
        console.error("User Dashboard Error: ", error.message);
    }
}