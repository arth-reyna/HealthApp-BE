import { NotFound } from "../../statusCodes.js";
import { deleteJwtToken } from "../../utils/jwt.js";

export const logoutBL = async (req, res) => {
  try {
    const token = req.cookies.token;
    console.log("Logout Token: ", token);

    if (token) {
      await deleteJwtToken(res);

    } else {
      return NotFound(res, "Token not found");

    }
  } catch (error) {
    console.error("Error during logout BL: ", error.message);
    throw error;
  }
};
