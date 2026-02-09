import express from "express";
import authRoutes from './auth/authRoutes.js';
import userRoutes from './users/userRoutes.js';

const router = express.Router();

//Auth ROute
router.use('/auth', authRoutes)

//User Route
router.use('/user', userRoutes);

export default router;
