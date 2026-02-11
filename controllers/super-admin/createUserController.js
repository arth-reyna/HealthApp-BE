import { createUser } from "../../services/super-admin/create-user-bl.js";
import { sendCreated } from "../../utils/responseHandler.js";

export const createUserController = async (req, res, next) => {
    try {
        const user = await createUser(req, res);

        return sendCreated(res, "User Created from Super Admin", user);

    } catch (error) {
        console.error(error);
        next(error);
    }
}