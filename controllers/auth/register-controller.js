import userRegisterBL from "../../services/auth/register-bl.js";

const register = async (req, res) => {
  try {
    const result = await userRegisterBL(req, res);
    // console.log("Register Result: ", result);

    // return res.status(201).json({ result });

  } catch (error) {

    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error registering user",
    });

  }
};

export default register;
