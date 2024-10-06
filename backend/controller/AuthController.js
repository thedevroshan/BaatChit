// Packages
import { validationResult } from 'express-validator'
import bcryptjs from 'bcryptjs';

// Models
import { User } from "../models/user.model.js"


export const register = async (req, res) => {
    try {
        const { username, name, email, password } = req.body;

        const result = validationResult(req)
        if(!result.isEmpty()){
            return res.status(400).json({ok: false, msg: result.array()})
        }

        if(username !== username.toLowerCase()){
            return res.status(400).json({ok: false, msg: 'Username should be in lowercase'})
        }

        if(name === ''){
            return res.status(400).json({ok: false, msg: 'Name is Required'})
        }

        const isExistingUsername = await User.findOne({username})
        if(isExistingUsername){
            return res.status(400).json({ok: false, msg: 'User is not available'})
        }

        const isExistingEmail = await User.findOne({email})
        if(isExistingEmail){
            return res.status(400).json({ok: false, msg: 'Email is already taken'})
        }

        const salt = await bcryptjs.genSalt(parseInt(process.env.SALT_LENGHT))
        const hashedPassword = await bcryptjs.hash(password, salt)

        await User.create({
            username,
            name,
            email,
            password: hashedPassword
        })

        res.status(200).json({ok: true, msg: 'Registered Successfully'})

        
    } catch (error) {
        if(process.env.NODE_ENV === 'development'){
            return console.log(error)
        }
        return res.status(500).send('Server Error')
    }
}