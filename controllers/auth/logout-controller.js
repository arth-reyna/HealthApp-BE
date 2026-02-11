import { logoutBL } from "../../services/auth/logout-bl.js";
import { sendSuccess } from "../../utils/responseHandler.js"

const logoutController = async (req, res, next) => {
    try {

        const logoutConn = await logoutBL(req, res);

        return sendSuccess(res, "Logged out successfully", logoutConn)

    } catch (error) {
        console.error("Error during logout");
        next(error);
    }
}

export default logoutController;