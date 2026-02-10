import { User } from "../../models/auth/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt.js";

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check Email and Password
    if (!email || !password) {
      return res.status(404).json({
        code: 404,
        message: "Enter Email or Password",
        sucess: false,
      });
    }

    // Find User
    const user = await User.findOne({ email });
    // console.log("User: ", user);

    // Check if user is present or not.
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "User not Found",
        sucess: false,
      });
    }

    // Verify Password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        code: 401,
        message: "Credentials are incorrect",
        sucess: false,
      });
    }

    //Generate Token
    const token = generateToken(user._id, user.role, res);
    console.log("token ",token)

    //User Logged in Scussful.
    return res.status(200).json({
      code: 200,
      message: "Login Sucessfull",
      sucess: true,
      token: token,
    });
  } catch (error) {
    console.log(error);
  }
};

export default userLogin;
