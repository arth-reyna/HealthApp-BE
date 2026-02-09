import jwt from "jsonwebtoken";

export const generateToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" }); 
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    signed: true,
    expires: new Date(Date.now() + 900000)
  })
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const deleteJwtToken = async (res) => {  
    res.clearCookie("token", { secure: true });
    return res
}