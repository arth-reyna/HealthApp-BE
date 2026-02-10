import { User } from "../../models/auth/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt.js";

const userRegister = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    // Find User
    const existingUser = await User.findOne({ email });
    console.log("User : ", existingUser);

    // Checking Existing User
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        code: 400,
      });
    }

    //Hash Password bfor register
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    console.log("Salt: ", salt);
    console.log("Hash Salt: ", hashPassword);

    // Create new User
    const user = await User.create({
      email: email,
      password: hashPassword,
    });

    //Sign JWT token
    const token = await generateToken(user._id, user.role, res);
    console.log("Token: ", token);

    return res.status(201).json({
      message: "User created successfully",
      code: 201,
      token: token
    });

  } catch (error) {
    console.log("Register Error: ", error);

    return res.status(500).json({
      success: false,
      code: 500,
      message: "Error registering user",
    });
  }
};

export default userRegister;
