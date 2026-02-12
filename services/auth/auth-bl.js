import { User } from "../../models/auth/User.js";
import bcrypt from "bcryptjs";
import { generateToken, deleteJwtToken } from "../../utils/jwt.js";
import {
  notFound,
  badRequest,
  sendSuccess,
} from "../../utils/responseHandler.js";
import { create, find, findOneEmail } from "../../utils/dbQueryHelper.js";
import crypto from "crypto";

export const userLoginBL = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check Email and Password
    if (!email || !password) {
      return notFound(res, "Enter email or password");
    }

    // Find User
    // const user = await findOneEmail({
    //   model: User,
    //   query: email,
    // });

    // Dynamic Filter
    const filter = {};
    if (email) filter.email = email;

    const UserArray = await find({
      model: User,
      filter,
    });

    const [user] = UserArray;

    console.log("User: ", user);

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

    return sendSuccess(res, "Login Successful", {
      token: token,
      role: user.role,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const logoutBL = async (req, res) => {
  try {
    const token = req.cookies.token;
    console.log("Logout Token: ", token);

    if (token) {
      await deleteJwtToken(res);
    } else {
      return notFound(res, "Token not found");
    }
  } catch (error) {
    console.error("Error during logout BL: ", error.message);
    throw error;
  }
};

export const userRegisterBL = async (req, res) => {
  try {
    const { email, password, gender, name } = req.body;
    console.log(email, password, gender, name);

    // Email Regex
    if (!email || !password) {
      return badRequest(res, "Please enter email or password");
    }

    // Find User
    // const existingUser = await findOneEmail({
    //   model: User,
    //   query: email,
    // });

    //find by email
    const filter = {};
    if (email) filter.email = email;

    const UserArray = await find({
      model: User,
      filter,
    });

    const [existingUser] = UserArray;
    console.log(existingUser);


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

    // Create new User
    const user = await User.create({
      email: email,
      password: hashPassword,
      gender: gender,
      name: name,
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

export const resetPasswordBL = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    console.log("Token: ", token);
    console.log("Password: ", password);
    console.log("ID : ", id);

    //Create hash token for verification before updating password
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("Hashed Token: ", hashedToken);

    if (password.length < 6) {
      return badRequest(res, "Password must contain atleast 6 characters");
    }

    const filter = {}
    if (id) filter.id = id;

    const user = await User.findOne({
      _id: id,
      passwordExpires: { $gt: Date.now() },
    });


    console.log("User Details: ", user);

    if (!user) {
      return badRequest(res, "Token is invalid or expired");
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Salt: ", salt, "Hashed Password: ", hashedPassword);

    //Update password
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } },
    );

    //Once sucess, delete token and expiry time.
    user.passwordToken = undefined;
    user.passwordExpires = undefined;

    await user.save();

    // const user = await User.findByIdAndUpdate(
    //   { _id: id },
    //   {
    //     $set: {
    //       password: hashPassword,
    //     },
    //   },
    // );

    // await User.updateOne({ id }, {$set: {password: hashPassword }})
    console.log(`Password for USerID: ${id} updated sucessfuly.`);

    return user;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};
