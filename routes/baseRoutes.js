import express from "express";
import userRoutes from './users/userRoutes.js';

const router = express.Router();

//User Route
router.use('/user', userRoutes);

export default router;
