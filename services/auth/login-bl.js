import { User } from "../../models/auth/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt.js";
import { findOneEmail } from "../../utils/dbQueryHelper.js";
import { notFound, badRequest, sendSuccess } from "../../utils/responseHandler.js";


const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check Email and Password
    if (!email || !password) {
      return notFound(res, "Enter email or password");

    }

    // Find User
    const user = await findOneEmail({
      model: User,
      query: email,
    });

    // Check if user is present or not.
    if (!user) {
      return notFound(res, "User not Found");

    }

    // Verify Password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return badRequest(res, "Incorrect credentials");

    }

    //Generate Token
    const token = await generateToken(user._id, user.role, res);
    console.log("token ", token);

    return sendSuccess(res, "Login Successful", {token: token, role: user.role});

  } catch (error) {

    console.log(error);
    throw error;
  }
};

export default userLogin;
