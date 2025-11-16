import mongoose from "mongoose";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v) => emailRegex.test(v),
            message: "Invalid email format"
        },
    },
    password: {
        type: String,
        required: true,
    },
},{
    timestamps: true
});

export default mongoose.model('User', userSchema);