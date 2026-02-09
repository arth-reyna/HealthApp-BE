import express from 'express';
import userRegister from '../../controllers/auth/register-controller.js';
import userLogin from '../../controllers/auth/login-controller.js';

const router = express.Router();

// Auth Routes
router.post('/register', userRegister);
router.post('/login', userLogin);

export default router;