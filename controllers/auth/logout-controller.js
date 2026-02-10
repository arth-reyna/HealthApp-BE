import { logoutBL } from "../../services/auth/logout-bl.js"

const logoutController = async (req, res) => {
    try {

        const logoutConn = await logoutBL(req, res);
        // console.log("Logged out: ",logoutConn);

        return res.status(200).json({
            code: 200,
            message: "Logged out sucess",
            sucess: true,
        })

    } catch (error) {
        console.error("Error during logout");
        
        return res.status(400).json({
            code: 400,
            message: "Error during Logout happened at Controller",
            success: false 
        })
    }
}

export default logoutController;