import { User } from "../../models/auth/User.js";
import { createOne, findOneEmail } from "../../utils/dbQueryHelper.js";
import { badRequest } from "../../utils/responseHandler.js";
import bcrypt from "bcryptjs";

export const createAdmin = async (req, res) => {
  try {
    const { email, password, gender} = req.body;

    // Check if details empty or not
    if (!email || !gender || !password) {
      return badRequest(res, `Some details are missing: ${email || gender || password}`);
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
    if(password.length < 6){
        return badRequest(res, "Password must be over 6 characters");
    }

    //If not, then hash the password before creating user.
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await createOne({
      model: User,
      query: {
        email: email,
        role: "user",
        password: hashPassword,
        gender: gender
      },
    });

    console.log("User created successfully");

    return user;

  } catch (error) {

    console.error(error);
    throw error;
  }
};
