import express from 'express';
import userRegister from '../../controllers/users/userRegister.js';

const router = express.Router();

// Register
router.post('/register', userRegister);



export default router;