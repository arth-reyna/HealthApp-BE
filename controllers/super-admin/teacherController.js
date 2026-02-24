import { createTeacherBL, deleteTeacherBL, editTeacherBL, getTeachersBL } from "../../services/super-admin/teacher-bl.js";
import { sendCreated, sendSuccess } from "../../utils/responseHandler.js"

export const createTeacherController = async(req, res, next) => {
    try {
        const teacher = await createTeacherBL(req, res)

        return sendCreated(res, "teacher created", teacher)

    } catch(error) {
        console.error(error)
        throw error;
    }
}

export const allTeacherController = async (req, res, next) => {
    try {
        const teacher = await getTeachersBL();

         return sendSuccess(res, "fetched all teachers", teacher)
    } catch (error) {
        throw error;
        next(error);
    }
} 

export const editTeacherController = async (req, res) => {
    try {
        const teacher = await editTeacherBL(req, res);

         return sendSuccess(res, "teacher editted")
    } catch (error) {
        next(error);
    }
}

export const deleteTeacherController = async( req, res) => {
    try {
        const teacher = await deleteTeacherBL(req, res);

        return sendSuccess(res, "teacher deleted")
    } catch (error) {
        
    }
}