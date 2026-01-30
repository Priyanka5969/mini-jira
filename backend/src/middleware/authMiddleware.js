import jwt from 'jsonwebtoken';
import { findUserById } from '../services/userService.js';

export default async function auth(req,res,next){
    // Try to get token from cookies first (preferred method)
    let token = req.cookies.token;
    
    // If no cookie token, try Authorization header (fallback for blocked cookies)
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }

    try {
        if(!token){
            return res.status(401).json({message: "Not logged in"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await findUserById(decoded.id);

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
}
