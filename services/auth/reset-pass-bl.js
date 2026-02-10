import { User } from "../../models/auth/User.js";
import bcrypt from "bcryptjs";


const resetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        console.log("ID: ", id, "Pass: ", password);

        if (password.length < 6) {
            return res.status(400).json({
                code: 400,
                message: "Password must contain atleast characters",
                success: false
            })
        }

        //Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        await User.findByIdAndUpdate({
            _id: id,
        }, {
            $set: {
                password: hashPassword
            }
        },
        )

        // await User.updateOne({ id }, {$set: {password: hashPassword }})
        console.log(`Password for USerID: ${id} updated sucessfuly.`)

        return res.status(200).json({
            code: 200,
            message: "Password updated sucessfully",
            success: true
        })

    } catch (error) {
        console.error(error.message);

        return res.status(400).json({
            code: 400,
            message: "Error Reseting password",
            success: false
        })
    }
}

export default resetPassword;