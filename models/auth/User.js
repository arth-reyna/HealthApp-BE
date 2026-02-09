import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true,
        unique: true
        
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    password: {
        type: String,
        required: true
    }
})

export const User = mongoose.model('User', userSchema);