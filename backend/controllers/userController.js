const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'1d'})
}

exports.registerUser =asyncHandler(async(req,res)=>{
    try {
        const {name,email,password} = req.body
        if(!email || !name || !password){
            res.status(400)
            throw new Error('Please fill in all required fields') 
        }
        if(password < 6){
            res.status(400)
            throw new Error('Password must be up to 6 charecter')
        }
        const userExist = await User.findOne({email})
        if(userExist){
            res.status(400)
            throw new Error('email has already used')
        }
        
        const user = await User.create(req.body)
        const token = await generateToken(user._id)
        res.cookie("token",token,{
            path:'/',
            httpOnly:true,
            expires:new Date(Date.now() + 1000 * 86400),
            sameSite:"none",
            secure:true
        })
        
        if(user){
            const {_id,name,email,phone,bio} = user
            res.status(201).json({
               success:true,
               message:"user created",
               user,
               token
            })
        }else{
            res.status(400)
            throw new Error("Invalid user data")
        }
       
    } catch (error) {
        console.log(error);
    }
})

exports.loginUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        res.status(400)
        throw new Error("Add email and password")
    }
    const user = await User.findOne({email})
    if(!user){
        res.status(400)
        throw new Error('User not found, please signup')
    }

    //user exists, check if password is correct
    const isMatch = await bcrypt.compare(password,user.password)
    const token = await generateToken(user._id)
        res.cookie("token",token,{
            path:'/',
            httpOnly:true,
            expires:new Date(Date.now() + 1000 * 86400),
            sameSite:"none",
            secure:true
        })
    if(user && isMatch){
        const {_id,name,email,phone,bio} = user
        res.status(200).json({
            
            
               success:true,
               message:"logged in",
               user,
               token
            
        })
    }else{
        res.status(400)
        throw new Error('Invalid Credential')
    }
    
})

exports.logout = asyncHandler(async(req,res)=>{
    res.cookie("token","",{
        path:'/',
        httpOnly:true,
        expires:new Date(0),
        sameSite:'none',
        secure:true
    })
    return res.status(200).json({
        message:"Successfully logged out"
    })
})

exports.getUser = asyncHandler(async(req,res)=>{
    res.send('users')
})