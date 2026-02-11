import { User } from "../../models/auth/User.js";
import bcrypt from "bcryptjs";
import { badRequest } from "../../utils/responseHandler.js";
import crypto from 'crypto';

const resetPassword = async (req, res) => {
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

    const user = await User.findOne({
      _id: id,
      resetPasswordExpires: { $gt: Date.now() }
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
    await User.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });

    //Once sucess, delete token and expiry time.
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

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

export default resetPassword;
