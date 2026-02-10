import { logoutBL } from "../../services/auth/logout-bl.js"

const logoutController = async (req, res) => {
    try {

        const logoutConn = await logoutBL(req, res);
        // console.log("Logged out: ",logoutConn);

        return res.status(200).json({
            code: 200,
            message: "Logged out sucess",
            sucess: true,
            data: logoutConn
        })

    } catch (error) {
        console.error("Error during logout");
        return error;
    }
}

export default logoutController;