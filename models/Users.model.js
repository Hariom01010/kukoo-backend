import mongoose, { mongo } from "mongoose"

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: false
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    friendRequests: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {type:String, enum: ['pending','rejected','accepted'],default: 'pending'}
    }]
})

const User = mongoose.model("User",userSchema)

export { User }