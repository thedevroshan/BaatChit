// Packages
import { validationResult } from 'express-validator'
import bcryptjs from 'bcryptjs';

// Models
import { User } from "../models/user.model.js"
import { OTP } from '../models/otp.model.js';

// Utils
import { CreateSendOTP } from '../utils/CreateSendOTP.js';
import { configuration } from '../config/config.js';


export const register = async (req, res) => {
    try {
        const { username, name, email, password } = req.body;

        const result = validationResult(req)
        if(!result.isEmpty()){
            return res.status(400).json({ok: false, msg: result.array()})
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

        await CreateSendOTP(email, configuration.OTP_EXPIRATION_MINUTE)

        await User.create({
            username,
            name,
            email,
            password: hashedPassword
        })

        res.status(200).json({ok: true, msg: 'Registered Successfully'})

    } catch (error) {
        if(configuration.NODE_ENV === 'development'){
            return console.log(error)
        }
        return res.status(500).send('Server Error')
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const {otp} = req.body;
        
        const isOTPExists = await OTP.findOne({otp})
        if(!isOTPExists){
            return res.status(404).json({ok: false, msg: 'OTP Not Found'})
        }

        if(Date.now() > isOTPExists.expiration){
            await OTP.findOneAndDelete({otp})
            return res.status(400).json({ok: false, msg: 'OTP Expired'})
        }

        const isUserExists = await User.findOne({email: isOTPExists.email})
        if(!isUserExists){
            return res.status(404).json({ok: false, msg: 'User not found'})
        }

        await User.findOneAndUpdate({email: isOTPExists.email},{$set:{verified: true}})
        await OTP.findOneAndDelete({otp})
        res.status(200).json({ok: true, msg: 'Verified Successfully'})
        
    } catch (error) {
        if(configuration.NODE_ENV === 'development'){
            return console.log(error)
        }
        return res.status(500).send('Server Error')
    }
}


export const resendOTP = async (req, res) => {
    try {
        const isSent = await CreateSendOTP(req.body.email, configuration.OTP_EXPIRATION_MINUTE)
        if(!isSent){
            return res.status(400).json({ok: false, msg: 'Unable to sent otp'})
        }
        res.status(200).json({ok: true, msg: 'OTP Sent'})        
    } catch (error) {
        if(configuration.NODE_ENV === 'development'){
            return console.log(error)
        }
        return res.status(500).send('Server Error')
    }
}

export const login = async (req,res) => {
    try {
        
    } catch (error) {
        if(configuration.NODE_ENV === 'development'){
            return console.log(error)
        }
        return res.status(500).send('Server Error')
    }
}