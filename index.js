import express from "express"
import mongoose from "mongoose"
import 'dotenv/config'
import cors from "cors"
import userRouter from "./routes/User.route.js"


const app = express()

const whitelistOrigin = ['http://localhost:5173','http://192.168.1.11:5173']

app.use(express.json())
app.use(cors({
    origin:  function (origin,callback){
        if(whitelistOrigin.indexOf(origin) != -1 || !origin){
            console.log("request processed succesfully")
            callback(null,true)
        }else{
            console.log("not allowed by cors")
            callback(new Error("Not allowed by cors"))
        }
    },
    methods: ['GET','PUT','POST','DELETE'],
    credentials: true
}))

app.use("/api/v1/user", userRouter)

let port = process.env.PORT;
if(port == null || port == ""){
    port = 5000;
}

app.get('/', (req,res)=>{
    res.send("helo world")
})


mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Database connected succesfully")
    app.listen(port,'0.0.0.0',()=>{console.log("server listening")})
}).catch(()=>{
    console.log("couldn't connect to server")
})
