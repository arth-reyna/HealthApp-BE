import userLoginBL from '../../services/auth/login-bl.js';

const loginUser = async (req, res) => {
    try {
        const result = await userLoginBL(req, res);
        
        return res.status(200).json({
            code: 200,
            message: "Login Sucessfull",
            sucess: true,
            token: token,
            result: result
        });
    } catch (error) {
        console.log(error);
    }
}

export default loginUser;