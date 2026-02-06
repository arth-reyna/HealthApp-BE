import jwt from 'jsonwebtoken';

const generateToken = (id) => {

    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};


export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

export default generateToken;