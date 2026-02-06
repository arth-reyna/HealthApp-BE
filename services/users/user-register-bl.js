import { User } from '../../models/users/User.js';
import bcrypt from 'bcryptjs';

const userRegister = async (data) => {
    try {
        const { email, password } = data;

        //Hash Password bfor register
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const existingUser = await User.findOne({ email });

        // Checking Existing User
        if (existingUser) {
            return {
                message: "User already exists",
                code: 400,
            };
        }

        // Create new User
        await User.create({
            email: email,
            password: hashPassword,
        });


        return {
            message: "User created successfully",
            code: 201,
        };
    } catch (error) {
        console.log("Register Error: ", error);
        return {
            success: false,
            code: 500,
            message: "Error registering user",
        };
    }
};

export default userRegister;