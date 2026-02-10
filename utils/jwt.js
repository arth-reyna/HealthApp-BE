import jwt from "jsonwebtoken";

export const generateToken = async (id, role, res) => {
  const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  console.log("Token from jwt: ", token);

  res.cookie("token", token, {
    httpOnly: false,
    signed: false,
  });

  return token;
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const deleteJwtToken = async (res) => {
  await res.clearCookie("token", {
    httpOnly: false,
    signed: false,
  });


};
