//Importing Libraries
import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './config/db.js';
import cors from 'cors';

import baseRoutes from './routes/baseRoutes.js'

dotenv.config()
const PORT = process.env.PORT || 5001;

// Initialize Server
const app = express();
app.use(express.json())
app.use(cors())

// Routes
app.get('/', (req, res) => {
    res.send("Server is running");
})

// Base Route
app.use('/api', baseRoutes);

//Server Connection
const startServerAndDatabase = async () => {
    try {
        app.listen(PORT, () => {
            dbConnect();
            console.log(`Server is live on port ${PORT}`)
        })
    } catch (error) {
        console.log("Server Error: ", error);
    }
}

startServerAndDatabase();