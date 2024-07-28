import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const protectRoute = async (req , res , next)=>{
try {
    const token = req.cookies.jwt;
    if(!token){
       return res.status(401).json({error : "Unauthorized : No Token Provided"})
    }
    const decoded = jwt.verify(token , process.env.JWT_SECRET);
    if(!decoded){
        return res.status(401).json({error : "Invalid token or expired"})
    }
    const user = await User.findById(decoded.userId).select("-password")
    req.user = user;
    next();
} catch (error) {
    console.log("Error in protect route " , error.message);
    return res.status(500).json({error : "Internal Server Error"})
}
}