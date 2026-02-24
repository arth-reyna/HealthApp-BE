import { transporter } from "../../utils/email.js";
import { User } from "../../models/auth/User.js";
import { badRequest } from "../../utils/responseHandler.js";
import crypto from "crypto";
import { logger } from "../../utils/logger.js";
import { BaseUserModel } from "../../module/user/user.model.js";

export const sendForgetPassMail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await BaseUserModel.findOne({ email });
    if (!user) {
      return badRequest(res, "Email not found");
    }

    //Create ResetToken
    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log("Reset Token: ", resetToken);

    //Create Hash token from reset token
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    console.log("Send Mail Hashed token: ", hashedToken);

    //Assign the hashed token to user:
    user.passwordToken = hashedToken;
    user.passwordExpires = Date.now() + 10 * 60 * 1000; // this is 10 minutes

    // save the data instantly to d database,
    await user.save();

    const link = `http://localhost:5002/api/auth/reset/${user._id}/${hashedToken}`;
    const message = `Reset by clicking this link: ${link}`;

    console.log("Reset Link: ", link);

    const mail = transporter.sendMail({
      to: email,
      subject: "Reset your Password",
      html: message,
    });

    logger.log({
      level: "info",
      label: "EMAIL",
      message: "email sent",
    });

    return mail.envelope;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};
