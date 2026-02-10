import { sendForgetPassMail } from '../../services/utils/send-email-bl.js';

const forgotPassword = async (req, res) => {
    try {
        const forgotPassCall = await sendForgetPassMail(req, res);
        return forgotPassCall;

    } catch (error) {
        console.error(error)

        return error;
    }
}

export default forgotPassword;