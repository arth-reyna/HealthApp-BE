import { deleteJwtToken } from '../../utils/jwt.js'

export const logoutBL = async (req, res) => {
    try {

        const token = req.signedCookies.token;
        console.log("Logout Token: ", token);

        if(token){
            await deleteJwtToken(res);

            return res.status(200).json({
            code: 200,
            message: "Token deleted sucessfully",
            sucess: true
            })

        }else{
            return res.status(404).json({
                code: 404,
                message: "Token not found",
                sucess: false
            })
        }

    } catch (error) {
        console.error("Error during logout BL: ", error.message);

        return res.status(404).json({
            code: 404,
            message: "Error during logout BL",
            sucess: false,
            error: error
        })
    }
}