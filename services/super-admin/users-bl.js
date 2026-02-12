import { User } from "../../models/auth/User.js";
import {
  create,
  findOneEmail,
  findByRole,
  findByID,
} from "../../utils/dbQueryHelper.js";
import { badRequest, notFound } from "../../utils/responseHandler.js";
import bcrypt from "bcryptjs";

export const createUserBL = async (req, res) => {
  try {
    const { email, password, gender, name } = req.body;

    // Check if details empty or not
    if (!email || !gender || !password || !name) {
      return badRequest(res, `Some details are missing`);
    }

    // Check if email present or already exists
    const emailValidate = await findOneEmail({
      model: User,
      query: email,
    });

    if (emailValidate) {
      return badRequest(res, "Email already exists!");
    }

    // Perform Password Validation Basic
    if (password.length < 6) {
      return badRequest(res, "Password must be over 6 characters");
    }

    //If not, then hash the password before creating user.
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await create({
      model: User,
      query: {
        email: email,
        role: "student",
        password: hashPassword,
        gender: gender,
      },
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
    const allUsers = await findByRole({
      model: User,
      query: "user",
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
      return badRequest(res, "Invalid ID or URL");
    }

    //Check if ID present or not.
    // const user = await findByID({
    //     model: User,
    //     query: email
    // })

    const user = User.findOne({ id });

    // console.log("User: ", user);

    if (!user) {
      return notFound(res, "User not Found");
    }

    // Take Updated values
    // const { email, password, gender, isActive, role } = req.body;
    const { password, ...otherData } = req.body;
    const updateData = { otherData };

    console.log("New Data: ", updateData);

    if (password) {
      if (password.length < 6) {
        return badRequest(res, "Password must be over 6 characters");
      }

      //If not, then hash the password before creating user.
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);

      console.log("final udate +: ",updateData)
    }
    console.log("last final: ",updateData)

    //Update Values
    // user.email = email || user.email;

    // if (gender !== undefined) user.gender = gender;
    // if (isActive !== undefined) user.isActive = isActive;

    // if (role && req.user?.role === "superadmin") {
    //   user.role = role;
    // }

    // user.password = hashPassword;

    const updated = await User.findByIdAndUpdate(id, {$set: updateData});

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
      return notFound(res, "id not found");
    }

    const deleted = await User.findByIdAndDelete(id);

    return deleted;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
