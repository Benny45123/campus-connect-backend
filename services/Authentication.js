const User=require('../models/userSchema');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY=process.env.SECRET_KEY;
const Register=async (req,res)=>{
    try{
        const {rollNo,email,password,name}=req.body;
        const existingUser=await User.findOne({$or:[{rollNo},{email}]});
        if(existingUser){
            return  res.status(400).json({message:"User with given roll number or email already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,12);
        const newUser=new User({rollNo,email,password:hashedPassword,name});
        await newUser.save();
        res.status(201).json({message:"User registered successfully"});

    }
    catch(error){
        console.error("Error during registration:",error);
        res.status(500).json({message:"Internal server error"});
    }
}
const Login=async (req,res)=>{
    try{
        const {rollNoOrEmail,password}=req.body;
        const user=await User.findOne({$or:[{rollNo:rollNoOrEmail},{email:rollNoOrEmail}]});
        if(!user){
            return res.status(400).json({message:"Invalid roll number/email or password"});
        }
        const passwordValid=await bcrypt.compare(password,user.password);
        if(!passwordValid){
            return res.status(400).json({message:"Invalid roll number/email or password"});
        }
        const token=jwt.sign({userId:user._id,userRollNo:user.rollNo,userEmail:user.email,userName:user.name},SECRET_KEY,{expiresIn:'1d'});
        res.cookie('token',token,{httpOnly:true,sameSite:'Lax',maxAge:24*60*60*1000});
        res.status(200).json({message:"Login successful",rollNo:user.rollNo,email:user.email,name:user.name});

    }
    catch(error){
        console.error("Error during login:",error);
        res.status(500).json({message:"Invalid or expired token"});
    }
}
const authenticateToken=(req,res,next)=>{
    try{
        const token=req.cookies.token;
        // console.log("Authenticating token:",token);
        if(!token){
            return res.status(401).json({message:"No token provided"});
        }
        const decoded=jwt.verify(token,SECRET_KEY);
        req.user=decoded;
        next();
    }
    catch(error){
        console.error("Error during token authentication:",error);
        res.status(500).json({message:"Internal server error"});
    }

}
const userSearch=async (req,res)=>{
    try{
        const userId=req.user.userId;
        const user=await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({rollNo:user.rollNo,email:user.email,name:user.name});
    }
    catch(error){
        console.error("Error during user search:",error);
        res.status(500).json({message:"Internal server error"});
}
}
module.exports={Register,Login,authenticateToken,userSearch};