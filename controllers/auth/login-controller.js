import userLoginBL from '../../services/auth/login-bl.js';

const loginUser = async (req, res) => {
    try {
        const result = await userLoginBL(req, res);
    
    } catch (error) {
        console.log(error);
    }
}

export default loginUser;