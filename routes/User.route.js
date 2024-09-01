import express from "express"
import { signup, searchUser, login, generateToken, sendFriendRequest } from "../controller/User.controller.js"
import hashPassword from "../middleware/hashPassword.js"

const router = express.Router()

router.post("/signup", hashPassword, signup)
router.get("/searchUser", searchUser)
router.post("/login", login)
router.get("/getToken",generateToken)
router.get("/sendRequest",sendFriendRequest)

export default router