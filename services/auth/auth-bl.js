import { User } from "../../models/auth/User.js";
import bcrypt from "bcryptjs";
import { generateToken, deleteJwtToken } from "../../utils/jwt.js";
import { notFound, badRequest } from "../../utils/responseHandler.js";
import { create, findOne, updateOne } from "../../utils/dbQueryHelper.js";
import crypto from "crypto";
import { logger } from "../../utils/logger.js";
import { BaseUserModel } from "../../module/user/user.model.js";

export const userLoginBL = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check Email and Password
    if (!email || !password) {
      logger.warn({
        level: "error",
        message: "not entered email or password",
        event: "LOGIN",
        label: "STUDENT",
      });

      return notFound(res, "Enter email or password");
    }

    // Find user by email
    const user = await findOne({
      model: User,
      filter: { email: email },
    });

    // Check if user is present or not.
    if (!user) {
      logger.warn({
        level: "error",
        message: "user not found",
        event: "LOGIN",
        label: "STUDENT",
      });

      return notFound(res, "User not Found");
    }

    // Verify Password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      logger.warn({
        level: "error",
        message: "incorrect credentials",
        event: "LOGIN",
        label: "STUDENT",
      });

      return badRequest(res, "Incorrect credentials");
    }

    //Generate Token
    const token = await generateToken(user._id, user.role, res);
    console.log("token ", token);

    logger.info({
      event: "LOGIN",
      message: `user: ${user.email} login sucessful`,
      label: "STUDENT",
      meta: user.email,
    });

    return {
      token: token,
      role: user.role,
    };
  } catch (error) {
    logger.warn({
      level: "error",
      message: "error during login",
      event: "LOGIN",
      label: "STUDENT",
    });
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

      logger.log({
        level: "info",
        message: "user logged out",
        event: "LOGOUT",
        label: "STUDENT",
      });
    } else {
      logger.warn({
        message: "token not found",
        event: "LOGOUT",
        label: "STUDENT",
      });
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
      logger.warn({
        message: "not entered email or password",
        event: "REGISTER",
        label: "STUDENT",
      });
      return badRequest(res, "Please enter email or password");
    }

    // Check if user already exists
    const existingUser = await findOne({
      model: User,
      filter: { email: email },
    });
    console.log(existingUser);

    // Checking Existing User
    if (existingUser) {
      logger.warn({
        message: "user already exists",
        event: "REGISTER",
        label: "STUDENT",
      });
      return badRequest(res, "User already exists!");
    }

    if (password) {
      if (password.length < 6) {
        logger.warn({
          message: "password less than 6 characters",
          event: "REGISTER",
          label: "STUDENT",
        });
        return badRequest(res, "Password must contain atleast 6 characters");
      }
    }

    //Hash Password bfor register
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new User
    const user = await create({
      model: User,
      data: {
        email: email,
        password: hashPassword,
        gender: gender,
        name: name,
      },
    });

    //Sign JWT token
    const token = await generateToken(user._id, user.role, res);
    console.log("Token: ", token);

    logger.log({
      level: "info",
      message: `user: ${user.email} registered`,
      label: "STUDENT",
      event: "REGISTER",
    });

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

    const user = await findOne({
      model: BaseUserModel,
      filter: {
        _id: id,
        passwordExpires: { $gt: Date.now() },
      },
    });

    // console.log("User Details: ", user);

    if (!user) {
      return badRequest(res, "Token is invalid or expired");
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Salt: ", salt, "Hashed Password: ", hashedPassword);

    //Update password and clear reset token
    await updateOne({
      model: BaseUserModel,
      filter: { _id: user._id },
      update: {
        password: hashedPassword,
        passwordToken: undefined,
        passwordExpires: undefined,
      },
    });

    console.log(`Password for USerID: ${id} updated sucessfuly.`);

    logger.log({
      level: "info",
      message: `user with ${id} reset password successfully`,
      event: "RESET",
      label: "STUDENT",
    });

    return user;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};
