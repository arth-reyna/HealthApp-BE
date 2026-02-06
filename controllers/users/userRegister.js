import userRegisterBL from '../../services/users/user-register-bl.js'

const addUser = async (req, res) => {
    try {
        console.log("body: ", req.body);

        const result = await userRegisterBL(req.body);

        return res.status(result.code).json({
            message: result.message,
            success: result.success,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error registering user",
            success: false,
        });
    }
};

export default addUser;