import bcrypt from "bcrypt"

const hashPassword = async (req,res,next)=>{
    const password = req.body.password
    const saltRounds = 10

    const hashPassword = await bcrypt.hash(password, saltRounds)
    req.body.password = hashPassword

    next()
}

export default hashPassword