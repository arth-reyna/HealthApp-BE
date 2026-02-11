import { User } from "../../models/auth/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt.js";
import { findOneEmail } from "../../utils/dbQueryHelper.js";
import { BadRequest, Created, ServerError } from "../../statusCodes.js";
import { badRequest, sendCreated } from "../../utils/responseHandler.js";

const userRegister = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    // Email Regex
    if (!email || !password) {
      return badRequest(res, "Please enter email or password");
    }

    // Find User
    const existingUser = await findOneEmail({
      model: User,
      query: email,
    });

    // Checking Existing User
    if (existingUser) {
      return badRequest(res, "User already exists!");
    }

    if (password.length < 6) {
      return badRequest(res, "Password must contain atleast characters");
    }

    //Hash Password bfor register
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // console.log("Salt: ", salt);
    // console.log("Hash Salt: ", hashPassword);

    // Create new User
    const user = await User.create({
      email: email,
      password: hashPassword,
    });

    //Sign JWT token
    const token = await generateToken(user._id, user.role, res);
    console.log("Token: ", token);

    return user;
  } catch (error) {
    console.log("Register Error: ", error);

    return error;
  }
};

export default userRegister;
