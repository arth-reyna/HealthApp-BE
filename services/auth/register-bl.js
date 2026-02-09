import { User } from '../../models/auth/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../utils/jwt.js';

const userRegister = async (data) => {
    try {
        const { email, password } = data;
        // console.log(email, password);

        // Find User
        const existingUser = await User.findOne({ email });
        console.log("User : ", existingUser);

        // Checking Existing User
        if (existingUser) {
            return {
                message: "User already exists",
                code: 400,
            };
        }

        //Hash Password bfor register
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        console.log("Salt: ", salt)
        console.log("Hash Salt: ", hashPassword)

        // Create new User
        const user = await User.create({
            email: email,
            password: hashPassword,
        });

        //Sign JWT token
        const token = generateToken(user._id);

        return {
            message: "User created successfully",
            code: 201,
            token: token
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