import { transporter } from '../../utils/email.js'
import { User } from "../../models/auth/User.js";

export const sendForgetPassMail = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                code: 400,
                message: "Email not found",
                success: false
            });
        }

        const link = `http://localhost:5001/api/auth/reset/${user._id}`;
        const message = `Reset by clicking this link: ${link}`;

        console.log("Reset Link: ", link);

        await transporter.sendMail({
            to: email,
            subject: "Reset your Password",
            html: message
        })

        return res.status(200).json({
            code: 200,
            message: "Mail sent sucessfully",
            success: true
        })

    } catch (error) {
        console.error(error.message);

        return res.status(400).json({
            code: 400,
            message: "Error sending Mail",
            success: false
        })
    }
}

