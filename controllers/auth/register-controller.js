import userRegisterBL from '../../services/auth/register-bl.js'

const register = async (req, res) => {
    try {
        const result = await userRegisterBL(req.body);
        console.log("Register Result: ", result);
        
        // Send response back to client
        return res.status(result.code).json(result);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error registering user"
        });
    }
};

export default register;