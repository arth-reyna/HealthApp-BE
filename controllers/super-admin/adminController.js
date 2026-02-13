import { createAdminBL, deleteAdminBL, editAdminBL, getAllAdminBL } from "../../services/super-admin/admin-bl.js"
import { sendCreated, sendSuccess } from "../../utils/responseHandler.js";

export const createAdminController = async (req, res, next) =>{
    try {
        const admin = await createAdminBL(req, res);

        return sendCreated(res, "admin created successfully", admin);
    } catch (error) {

        console.error(error);
        next(error);
    }
}

export const editAdminController = async (req, res, next) => {
    try {
        const admin = await editAdminBL(req, res);

        return sendSuccess(res, "admin details updated sucessfully", admin);
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export const deleteAdminController = async (req, res, next) => {
    try {
        const admin = await deleteAdminBL(req, res);

        return sendSuccess(res, "admin deleted sucessfully", admin);
    } catch (error) {
        console.error(error.message);
        next(error);
    }
}

export const getAdminController = async (req, res, next) => {
    try {
        const admin = await getAllAdminBL();

        return sendSuccess(res, "fetched all admins", admin);
    } catch (error) {
        console.error(error.message);
        next(error);
    }
}