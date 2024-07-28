import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateTokenAndSetCookie.js";

export const signup = async (req,res)=>{
    // Implement signup functionolity with format checking
    try {
        const {fullName ,username, email , password} =req.body;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error : "Invalid Email Format"})
        }
        const existingUser = await User.findOne({username})
        if(existingUser){
            return res.status(400).json({error : "Username already exists"})
        }
        const existingEmail = await User.findOne({email})
        if(existingEmail){
            return res.status(400).json({error : "Email is already taken"})
        }
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);

        const newUser = new User({
            fullName,
            username,
            password : hashedPassword,
            email

        })
        if(newUser){
            generateTokenAndSetCookie(newUser._id , res)
            await newUser.save();
            res.status(201).json({
                _id : newUser._id,
                fullName : newUser.fullName,
                username : newUser.username,
                email : newUser.email,
                followers : newUser.followers,
                following : newUser.following,
                profileImg : newUser.profileImg,
            })
        }else{
            res.status(400).json({error : "Invalid User Data"})
        }

    } catch (error) {
        res.status(500).json({error : "Internal server error"})
        console.log("Error in singup controller" , error.message);
    }
}
export const login = async (req,res)=>{
    try {
       const {username , password} = req.body;
       const user = await User.findOne({username});
       if(user){
        const isPasswordValid = await bcrypt.compare(password , user.password);
        if(isPasswordValid){
            generateTokenAndSetCookie(user._id , res)
            res.status(201).json({
                _id : user._id,
                fullName : user.fullName,
                username : user.username,
                email : user.email,
                followers : user.followers,
                following : user.following,
                profileImg : user.profileImg,
            })
        }else{
            res.status(400).json({error : "Invalid Username or Password"})

        }
       }else{
        res.status(400).json({error : "Invalid Username or Password"})
       }
    } catch (error) {
        res.status(500).json({error : "Internal server error"})
        console.log("Error in Login controller" , error.message);
    }
}
export const logout = async (req,res)=>{
    try {
        res.cookie("jwt" , " ", {maxAge : 0});
        res.status(200).json({message : "Logout Successfull"})
    } catch (error) {
        console.log("Error in logout controller " , error.message);
        res.status(500).json({error : "Internal Sever Error"})
    }
}
export const getMe = async (req,res)=>{
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({error : "Internal Server Error"})
        console.log("Error in GetMe Controller " , error.message);
    }
}