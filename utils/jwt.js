import jwt from "jsonwebtoken";

export const generateToken = (id, role, res) => {
  const token = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
  res.cookie("token", token, {
    httpOnly: true,
    signed: true
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const deleteJwtToken = async (res) => {
  res.clearCookie("token", { secure: true });
  return res;
};
