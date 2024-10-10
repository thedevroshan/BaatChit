// Packages
import { validationResult } from 'express-validator'
import bcryptjs from 'bcryptjs';

// Models
import { User } from "../models/user.model.js"
import { OTP } from '../models/otp.model.js';

// Configuration File
import { configuration } from '../config/config.js';

// Utils
import { CreateSendOTP } from '../utils/CreateSendOTP.js';
import { CreateJWTToken } from '../utils/JWTToken.js';
import { ValidateOTP } from '../utils/ValidateOTP.js';


// Register
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

        await CreateSendOTP(email, configuration.OTP_EXPIRATION_MINUTE, 'Email Verification', `OTP For Email Verification. Not this otp will be expired in ${configuration.OTP_EXPIRATION_MINUTE} minute`, null)

        await User.create({
            username,
            name,
            email,
            password: hashedPassword
        })

        res.status(200).json({ok: true, msg: 'Registered Successfully'})

    } catch (error) {
        if(configuration.IS_DEV_ENV){
            return console.log(error)
        }
        return res.status(500).send('Server Error')
    }
}

// Verfiy Email
export const verifyEmail = async (req, res) => {
    try {
        const {otp} = req.body;

        const isValidated = await ValidateOTP(otp)

        if(!isValidated.ok){
            return res.status(400).json({ok: false, msg: isValidated.msg})
        }

        const isUserExists = await User.findOne({email: isValidated.email})
        if(!isUserExists){
            return res.status(404).json({ok: false, msg: 'User not found'})
        }

        await User.findOneAndUpdate({email: isOTPExists.email},{$set:{verified: true}})
        await OTP.findOneAndDelete({otp})

        const token = await CreateJWTToken({userId: isUserExists._id}, configuration.JWT_SECRET)
        res.cookie('token', token)
    } catch (error) {
        if(configuration.IS_DEV_ENV){
            return console.log(error)
        }
        return res.status(500).send('Server Error')
    }
}

// Resend OTP
export const resendOTP = async (req, res) => {
    try {
        const isSent = await CreateSendOTP(req.body.email, configuration.OTP_EXPIRATION_MINUTE, 'Email Verification', `OTP For Email Verification. Not this otp will be expired in ${configuration.OTP_EXPIRATION_MINUTE} minute`, null)
        if(!isSent){
            return res.status(400).json({ok: false, msg: 'Unable to sent otp'})
        }
        res.status(200).json({ok: true, msg: 'OTP Sent'})        
    } catch (error) {
        if(configuration.IS_DEV_ENV){
            return console.log(error)
        }
        return res.status(500).send('Server Error')
    }
}

// Login
export const login = async (req,res) => {
    try {
        const { email_or_username, password } = req.body;

        const isUserExists = await User.findOne({email: email_or_username}) || await User.findOne({username: email_or_username})

        if(!isUserExists){
            return res.status(404).json({ok: false, msg: 'Email or Username not found'})
        }

        const isPassword = await bcryptjs.compare(password, isUserExists.password)
        if(!isPassword){
            return res.status(400).json({ok: false, msg: 'Incorrect Password'})
        }

        const token = await CreateJWTToken({userId: "isUserExists._id"}, configuration.JWT_SECRET)
        res.cookie('token', token)
    } catch (error) {
        if(configuration.IS_DEV_ENV){
            return console.log(error)
        }
        return res.status(500).send('Server Error')
    }
}

// Logout
export const logout = async (req,res) => {
    try {
        res.cookie('token', '')
    } catch (error) {
        if(configuration.IS_DEV_ENV){
            return console.log(error)
        }
        return res.status(500).send('Server Error')
    }
}