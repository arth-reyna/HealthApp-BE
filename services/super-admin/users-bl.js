import { User } from "../../models/auth/User.js";
import {
  create,
  find,
  findOne,
  updateOne,
  deleteOne,
} from "../../utils/dbQueryHelper.js";
import {logger} from "../../utils/logger.js";
import { badRequest, notFound } from "../../utils/responseHandler.js";
import bcrypt from "bcryptjs";

export const createUserBL = async (req, res) => {
  try {
    const { email, password, gender, name } = req.body;

    // Check if details empty
    if (!email || !gender || !password || !name) {
      logger.warn({
        message: "some details are missing",
        event: "REGISTER",
        reason: "DETAILS_MISSING",
      });
      throw badRequest(res, `Some details are missing`);
    }

    // Check if email already exists
    const emailValidate = await findOne({
      model: User,
      filter: { email: email },
    });

    if (emailValidate) {
      logger.warn({
        message: "email already exists",
        event: "REGISTER",
        reason: "SAME_EMAIL",
      });
      throw badRequest(res, "Email already exists!");
    }

    // Password Validation Basic
    if (password.length < 6) {
      logger.warn({
        message: "password must be over 6 characyers",
        event: "REGISTER",
        reason: "PASSWORD_VALIDATION",
      });

      throw badRequest(res, "Password must be over 6 characters");
    }

    //If not, then hash the password before creating user.
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await create({
      model: User,
      data: {
        email: email,
        name: name,
        role: "student",
        password: hashPassword,
        gender: gender,
      },
    });

    logger.log({
      level: "info",
      label: "SUPERADMIN",
      message: `created student: ${email}`,
      event: "REGISTER",
    });
    console.log("User created successfully");

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const allUsersBL = async (req, res) => {
  try {
    const allUsers = await find({
      model: User,
      filter: { role: "student" },
    });

    logger.log({
      level: "info",
      label: "SUPERADMIN",
      event: "FETCH",
      message: "fetched all students",
    });
    return allUsers;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editUserBL = async (req, res) => {
  try {
    //Fetch User's ID first
    const { id } = req.params;

    if (!id) {
      throw badRequest(res, "Invalid ID or URL");
    }

    // Check if user exists
    const user = await findOne({
      model: User,
      filter: { _id: id },
    });

    // console.log("User: ", user);

    if (!user) {
      throw notFound(res, "User not Found");
    }

    // update data
    const { password, ...otherData } = req.body;
    const updateData = { ...otherData };

    console.log("New Data: ", updateData);

    if (password) {
      if (password.length < 6) {
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
      label: "SUPERADMIN",
      message: `updated user: ${user.email}`,
      event: "UPDATE",
      ip: req.ip,
      level: "info",
    });
    //Update once fetched values
    // await user.save();

    console.log("User updated successfully");

    return updated;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//Delete User
export const deleteUserBL = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw notFound(res, "id not found");
    }

    const deleted = await deleteOne({
      model: User,
      filter: { _id: id },
    });

    logger.log({
      label: "SUPERADMIN",
      message: `deleted user: ${id}`,
      event: "DELETE",
      level: "info",
    });

    return deleted;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
