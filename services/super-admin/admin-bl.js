import { User } from "../../models/auth/User.js";
import { create, deleteOne, findOne, updateOne, find } from "../../utils/dbQueryHelper.js";
import { badRequest, notFound } from "../../utils/responseHandler.js";
import bcrypt from "bcryptjs";

export const createAdminBL = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return badRequest(res, "Email or Password not entered");
    }

    const checkEmail = await findOne({
      model: User,
      filter: { email: email },
    });

    //If Mail already present
    if (checkEmail) {
      return badRequest(res, "Email already exists!");
    }

    if (password) {
      if (password.length < 6) {
        return badRequest(res, "Password must be over 6 characters");
      }
    }

    //If not, then hash the password before creating user.
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await create({
      model: User,
      data: {
        email: email,
        role: "admin",
        password: hashPassword,
      },
    });

    console.log("Admin created successfully");

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editAdminBL = async (req, res) => {
  try {
    //Fetch Admin ID
    const { id } = req.params;

    if (!id) {
      return badRequest(res, "Invalid Admin ID");
    }

    const admin = await findOne({
      model: User,
      filter: { _id: id },
    });

    if (!admin) {
      return notFound(res, "Admin not found");
    }

    if (admin.role !== "admin") {
      return badRequest(res, "role is not admin")
    }

    const { password, ...otherData } = req.body;
    const updateData = { ...otherData }; //Destructure array to obj

    if (password) {
      if (password.length < 6) {
        return badRequest(res, "Password must be over 6 characters");
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updated = await updateOne({
      model: User,
      filter: { _id: id },
      update: updateData,
    });

    console.log("Admin updated successfully");

    return updated;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export const deleteAdminBL = async (req, res) => {
  try {
    const { id } = req.params;

    if(!id){
      throw notFound(res, "id not found");
    }

    //Check if ID role is admin only or not
    const admin = await findOne({
      model: User,
      filter: {_id : id}
    })
    console.log("Admin ROle: ", admin.role);

    if (admin.role !== "admin" || !admin.id){
      throw badRequest(res, "role is not admin")
    }

    const deleted = await deleteOne({
      model: User,
      filter: {_id: id }
    });

    return deleted;
  } catch (error) {

    console.error(error);
    throw error;
  }
}

export const getAllAdminBL = async (req, res) => {
  try {
    const allAdmins = await find({
      model: User, 
      filter: {role: "admin"},
    });

    return allAdmins;

  } catch (error) {
    console.error(error);
    throw error;

  }
}