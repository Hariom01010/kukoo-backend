import { User } from "../models/Users.model.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()


const signup = async (req,res)=>{
    try{
        const product = await User.create(req.body)
        res.status(200).send("user created successfully")
    }catch (error){
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

const login = async (req,res)=>{
    try{    
        const user = await User.findOne({username: req.body.username, password: req.body.password})
        console.log(user)
        if(user == ""){
            res.status(409).send("User not found")
        }else{
            const payload = {fname: user.fname, username: user.username, email: user.email}
            const accessToken = jwt.sign(payload,process.env.ACCESS_TOKEN,{expiresIn: "1 minutes"})
            const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {expiresIn: "3 minutes"})
            
            await User.updateOne({username:user.username},{
                $set: {refreshToken: refreshToken}
            })

            res.cookie('jwt',refreshToken,{ httpOnly: true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000})
            res.status(200).json({accessToken})
        }
    }catch(error){
        res.send(error)
    }
}

const generateToken = (req,res)=>{
    try{
        console.log(req.headers),
        console.log(res.headers)
        res.send(200)
    }catch(error){
        console.log(error)
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