import { User } from "../models/Users.model.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
dotenv.config()


const signup = async (req,res)=>{
    try{
        const user = await User.findOne({username: req.body.username}) //checks if user already exists in DB
        console.log(user.username)
        if(user.username == req.body.username){
            res.status(409).json({message: "User already exists"})  
        }else{
            const product = await User.create(req.body)
            res.status(200).json({message:"User created successfully"})
        }
    }catch (error){
        res.send(error)
    }
}


const login = async (req,res)=>{
    try{

        const user = await User.findOne({username: req.body.username})
        
        if(user == null){
            res.status(409).json({message:"User not found"})
        }else{

            const isPasswordSame = await bcrypt.compare(req.body.password, user.password)
            if(!isPasswordSame){
                res.status(401).json({message: "Unauthorized Access"})
            }else{
                const payload = {fname: user.fname, username: user.username, email: user.email}
                const accessToken = jwt.sign(payload,process.env.ACCESS_TOKEN,{expiresIn: "5 minutes"})
                const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {expiresIn: "10 minutes"})
                
                await User.updateOne({username:user.username},{
                    $set: {refreshToken: refreshToken}
                })
    
                res.cookie('jwt',refreshToken,{ httpOnly: true, sameSite: 'None', secure: true, maxAge: 10*60*1000})
                res.status(200).json({accessToken})
            }
        }    
    }catch(error){
        res.send(error)
    }
}


const searchUser = async (req,res)=>{
    try{
        console.log(req.query.username)
        const product = await User.find({
            username:req.query.username
        })
        console.log(product)
        res.status(200).json(product)
    }catch(error){
        res.send(error)
    }
}


const generateToken = (req,res)=>{
    try{
        const refreshToken = req.headers.cookie
        const accessToken = req.headers.authorization.split(" ")

        if(refreshToken == undefined){
            res.status(401).send("Refresh Token Expired")
        }else{
           const refreshTokenContent = refreshToken.split("=")
           if(accessToken[1] == undefined){
                const validateRefreshToken = jwt.verify( refreshTokenContent[1], process.env.REFRESH_TOKEN)
                const payload = {fname: validateRefreshToken.fname, username: validateRefreshToken.username, email: validateRefreshToken.email}
            
                const newAccessToken = jwt.sign(payload,process.env.ACCESS_TOKEN, {expiresIn: "5 minutes"})
                res.status(200).json({newAccessToken})
            }else{
                res.status(200).send("User is authorised")
            }
        }
    }catch(error){
        res.status(401).send(error)
    }
}



const sendFriendRequest = async (req,res)=>{
    try{
        const receiver = await User.findOne({username:req.body.receiverUserName})
        const sender = await User.findOne({username: req.body.senderUserName})

        console.log(receiver)
        console.log(sender)

        const request = await User.updateOne({_id: receiver._id},
            {$set: {friendRequests: {sender: sender._id, state:"pending"}}}
        )

        res.status(200).send("request sent succesfully")
    }catch(error){
        console.log(error)
    }
}

export {signup, searchUser, login, generateToken, sendFriendRequest}