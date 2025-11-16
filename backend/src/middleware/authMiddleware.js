import jwt from 'jsonwebtoken';
import { findUserById } from '../services/userService.js';

export default async function auth(req,res,next){
    console.log("🔍 Cookies received in middleware:", req.cookies);

    const token = req.cookies.token;
    console.log("🔍 Token extracted:", token);

    try {
        if(!token){
            console.log("❌ No token found in cookies");
            return res.status(401).json({message: "Not logged in"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔍 Token decoded:", decoded);

        req.user = await findUserById(decoded.id);
        console.log("🔍 User found from DB:", req.user);

        next();
    } catch (error) {
        console.log("❌ AUTH ERROR:", error);
        res.status(401).json({ message: "Unauthorized" });
    }
}
