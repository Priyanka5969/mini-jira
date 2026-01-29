import User from "../models/User.js";

export const findByEmail = (email) => {
    // Normalize email: trim whitespace and convert to lowercase for case-insensitive lookup
    if (!email) return null;
    const normalizedEmail = email.trim().toLowerCase();
    // Use case-insensitive regex for lookup (handles existing users with mixed case)
    return User.findOne({ 
        email: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } 
    });
};

export const createUser = (data) => {
    // Normalize email before creating user
    const normalizedData = {
        ...data,
        email: data.email?.trim().toLowerCase()
    };
    return User.create(normalizedData);
};

export const findUserById = (id) => User.findById(id).select("-password");

export const getAllUsers = () => User.find().select("name email");
