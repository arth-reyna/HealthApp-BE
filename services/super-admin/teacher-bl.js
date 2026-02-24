import { User } from "../../models/auth/User.js";
import { find, create } from "../../utils/dbQueryHelper.js";
import {logger} from "../../utils/logger.js";
import { badRequest } from "../../utils/responseHandler.js";
import bcrypt from "bcryptjs";

export const createTeacherBL = async (req, res) => {
    try {
        const { email, password, name, domain } = req.body;

        if (!email || !password || !name || !domain) {
            logger.warn({
                    label: "TEACHER",
                    message: "details missing",
                    event: "REGISTER"
                  })
            throw notFound(res, "Some details not found");
        }

        //check email exists or not
        const isExists = await findOne({
            model: User,
            filter: { email: email }
        });

        if (isExists) {
            logger.warn({
                    label: "TEACHER",
                    message: "teacher already exists",
                    event: "REGISTER"
                  })
            throw badRequest(res, "user already exists")
        }

        if (password) {
            if (password.length < 6) {
                logger.warn({
                    label: "TEACHER",
                    message: "password length short",
                    event: "REGISTER"
                })
                throw badRequest(res, "password must contain  6 letters")
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            const teacher = await create({
                model: User,
                data: {
                    email: email,
                    password: hashPassword,
                    role: "teacher",
                    name: name,
                    domain: domain
                }
            });

            logger.log({
                level: "info",
                label: "TEACHER",
                message: `created teacher ${email}`,
                event: "REGISTER"
            })
            console.log("Teacher created")
            return teacher;
        }

    } catch (error) {
        console.error(error)
        throw error;
    }
}

export const getTeachersBL = async (req, res) => {
    try {
        const teachers = await find({
            model: User,
            filter: { role: "teacher" }
        })

        return teachers;

    } catch (error) {
        throw error;
    }
}

export const deleteTeacherBL = async (req, res) => {
    try {
        // Fetch ID first
        const { id } = req.params;

        if (!id) {
            logger.warn({
                    label: "TEACHER",
                    message: "ID missing",
                    event: "DELETE"
                  })
            throw badRequest(res, "Id not entered");
        }

        const teacher = await findOne({
            model: User,
            filter: { _id: id }
        })

        if (!teacher) {
            logger.warn({
                    label: "TEACHER",
                    message: "teacher not found",
                    event: "DELETE"
                  })
            throw badRequest(res, "Teacher not found");
        }

        await User.findByIdAndDelete({ id });

        logger.log({
                level: "info",
                event: "DELETE",
                label: "SUPERADMIN",
                message: `deleted teacher ${id}`
            })
        return teacher;

    } catch (error) {
        throw error;
    }
}

export const editTeacherBL = async (req, res) => {
    try {
        //Fetch User's ID first
        const { id } = req.params;

        if (!id) {
            logger.warn({
                    label: "TEACHER",
                    message: "ID missing",
                    event: "UPDATE"
                  })
            throw badRequest(res, "Invalid ID or URL");
        }

        // Check if user exists
        const teacher = await findOne({
            model: User,
            filter: { _id: id },
        });

        // console.log("User: ", user);

        if (!teacher) {
            logger.warn({
                    label: "TEACHER",
                    message: "teacher not found",
                    event: "UPDATE",
                    ip: req.ip
                  })
            throw notFound(res, "teacher not Found");
        }

        // update data
        const { password, ...otherData } = req.body;
        const updateData = { ...otherData };

        console.log("New Data: ", updateData);

        if (password) {
            if (password.length < 6) {
                logger.warn({
                    label: "TEACHER",
                    message: "password length is short",
                    event: "UPDATE",
                    ip: req.ip
                  })
                throw badRequest(res, "Password must be over 6 characters");
            }

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        // Update user
        const updated = await updateOne({
            model: User,
            filter: { _id: id },
            update: updateData,
        });

        logger.log({
                level: "info",
                label: "TEACHER",
                event: "UPDATE",
                message: `updated teacher ${id}`
            })

        console.log("Teacher updated successfully");

        return updated;
    } catch (error) {
        throw error;
    }
}