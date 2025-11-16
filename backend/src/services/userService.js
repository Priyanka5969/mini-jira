import User from "../models/User.js";

export const findByEmail = (email) => User.findOne({email});

export const createUser = (data) => User.create(data);

export const findUserById = (id) => User.findById(id).select("-password");

export const getAllUsers = () => User.find().select("name email");
