import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findByEmail, findUserById, getAllUsers } from '../services/userService.js';

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


const sendToken = (user, res) => {
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: "2d",
    });

    res.cookie("token", token , {
        httpOnly: true,
    });

    res.json({
        message: "Success",
        user: {id: user._id, name: user.name, email: user.email},
    });
};

export const register = async(req,res,next) => {
    try {
        const {name, email, password} = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({message: "Name, email, and password are required"});
        }

        const exists = await findByEmail(email);
        if(exists){
            return res.status(400).json({message: "Email already exists"});
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
              message:
                "Password must contain 8 chars, 1 uppercase, 1 number, 1 special char",
            });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await createUser({name, email, password: hashed});

        sendToken(user, res);
    } catch (error) {
        next(error);
    }
}

export const login = async(req,res,next) => {
    try {
        const {email, password} = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({message: "Email and password are required"});
        }

        const user = await findByEmail(email);
        if(!user){ 
            return res.status(400).json({message:"Invalid credentials"});
        }

        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(400).json({message: "Invalid credentials"})
        }

        sendToken(user, res);
    } catch (error) {
        next(error);
    }
}

export const logout = async(req, res) => {
    res.clearCookie("token");
    res.json({message: "Logged out"});
};

export const me = async(req,res) => {
    res.json({user: req.user});
}

export const userslist = async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
};
