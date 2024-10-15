// Packages
import bcryptjs from "bcryptjs"
import { validationResult } from "express-validator"

// Config File
import { configuration } from "../config/config.js"


// Models
import { User } from "../models/user.model.js"
import { OTP } from "../models/otp.model.js"


// Utils
import { CreateSendOTP } from "../utils/CreateSendOTP.js"
import { ValidateOTP } from "../utils/ValidateOTP.js"


// Get User Profile
export const getUserPorifle = async (req, res) => {
    try {
        const isUserExists = await User.findById(req.user.id).select('-password')
        if (!isUserExists) {
            return res.status(404).json({ ok: false, msg: 'User not found' })
        }
        res.status(200).json({ ok: true, msg: `User Profile of ${isUserExists.username}`, data: isUserExists })
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}

export const updateEmail = async (req, res) => {
    try {
        // User will first request to change the email. Server will sent a otp to change the email
        if (req.query.update == 'change_email_request') {
            const isSent = await CreateSendOTP(null, configuration.OTP_EXPIRATION_MINUTE, 'Email Change', `OTP for changing email. Note this otp will be expired in ${configuration.OTP_EXPIRATION_MINUTE} minute`, req.user.id)

            if (!isSent) {
                return res.status(400).json({ ok: false, msg: 'Unable to send otp' })
            }
            res.status(200).json({ ok: true, msg: 'OTP Sent' })
        }

        // Change Email
        if (req.query.update == 'email') {
            const { otp, new_email } = req.body;
            const result = validationResult(req)

            if (!result.isEmpty()) {
                return res.status(400).json({ ok: false, msg: result.array()[0].msg })
            }

            const isValidated = await ValidateOTP(otp)
            if(!isValidated.ok){
                return res.status(400).json({ok: false, msg: isValidated.msg})
            }

            // Changing User's email
            await User.findByIdAndUpdate({ _id: req.user.id }, { $set: { email: new_email } })
            // Deleting the otp
            await OTP.findOneAndDelete({ otp })
            res.status(200).json({ ok: true, msg: 'Email Changed Successfully' })
        }
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}


export const updateName = async (req, res) => {
    try {
        const { name } = req.body;
        await User.findByIdAndUpdate(req.user.id, { $set: { name } })
        res.status(200).json({ ok: true, msg: 'Name changed successfully' })
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}

export const updateUsername = async (req, res) => {
    try {
        const { username } = req.body;
        const result = validationResult(req)

        if (!result.isEmpty()) {
            return res.status(400).json({ ok: false, msg: result.array()[0].msg })
        }

        const isUserExists = await User.findOne({ username })
        if (isUserExists) {
            return res.status(400).json({ ok: false, msg: 'Username is not available' })
        }
        await User.findByIdAndUpdate(req.user.id, { $set: { username } })
        res.status(200).json({ ok: true, msg: 'Username changed successfully' })
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}

export const updateBio = async (req, res) => {
    try {
        const { bio } = req.body;
        await User.findByIdAndUpdate(req.user.id, { $set: { bio } })
        res.status(200).json({ ok: true, msg: 'Bio changed successfully' })
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}

export const updatePassword = async (req, res) => {
    try {
        const {current_password, password} = req.body;
        const result = validationResult(req)

        if(!result.isEmpty()){
            return res.status(400).json({ok: false, msg: result.array()[0].msg})
        }

        const isUserExists = await User.findById(req.user.id)
        if(!isUserExists){
            return res.status(404).json({ ok: false, msg: 'User not found' })
        }

        const isPassword = await bcryptjs.compare(current_password, isUserExists.password)
        if(!isPassword){
            return res.status(400).json({ ok: false, msg: 'Incorrect Current Password' })
        }

        const salt = await bcryptjs.genSalt(parseInt(configuration.SALT_LENGHT))
        const newHashedPassword = await bcryptjs.hash(password, salt)

        await User.findByIdAndUpdate(req.user.id, {$set: {password: newHashedPassword}})
        res.status(200).json({ok: true, msg: 'Password Changed Successfully'})
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}

export const forgetPassword = async (req, res) => {
    try {
        const {email_or_username} = req.body;

        const isUserExists = await User.findOne({username: email_or_username}) || await User.findOne({email: email_or_username})

        if(!isUserExists){
            return res.status(404).json({ok: false, msg: 'User not found'})
        }

        await CreateSendOTP(isUserExists.email, configuration.OTP_EXPIRATION_MINUTE, 'Reset Password', `Here is your otp to reset your password. Note this otp will be expired in ${configuration.OTP_EXPIRATION_MINUTE} minute`,null)
        
        res.status(200).json({ok: true, msg: 'Please check your email spam or inbox. We sent you the otp to reset password'})
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}

export const resetPassword  = async (req, res) => {
    try {
        const {otp,password, confirm_password} = req.body
        const result = validationResult(req)

        if(!result.isEmpty()){
            return res.status(400).json({ok: false, msg: result.array()[0].msg})
        }

        if(password !== confirm_password){
            return res.status(400).json({ok: false, msg: 'New Password and Confirm Password Should Be Equal'})
        }

        const isValidated = await ValidateOTP(otp)
        if(!isValidated.ok){
            return res.status(400).json({ok: false, msg: isValidated.msg})
        }

        const salt = await bcryptjs.genSalt(parseInt(configuration.SALT_LENGHT))
        const newHashedPassword = await bcryptjs.hash(confirm_password, salt)
        
        await User.findOneAndUpdate({email: isValidated.user}, {$set: {password: newHashedPassword}})
        res.status(200).json({ok: true, msg: 'Password Reset Successfully'})        
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}

// Update Links
export const updateLinks = async (req, res) => {
    try {
        if(req.body.url_name == '' && req.body.url == ''){
            return res.status(400).json({ok: false, msg: 'URL name and URL are required'})
        }

        const user = await User.findById(req.user.id)


        if(user.links.some(item => item._id == req.params.link_id)){
            const isUpdated = await User.updateOne(
                {
                    _id: req.user.id,
                    "links._id": req.params.link_id
                },
                {
                    $set: {
                        'links.$.url_name': req.body.url_name,
                        'links.$.url': req.body.url
                    }
                }
            )

            if(!isUpdated){
                return res.status(400).json({ok: false, msg: 'Unable to update link'})
            }
            
            return res.status(400).json({ok: true, msg: 'Link updated successfully'})
        }
        else {
            const isAdded = await User.updateOne(
                {
                    _id: req.user.id,
                },
                {
                    $push: {
                        links: {
                            url_name: req.body.url_name,
                            url: req.body.url
                        }
                    }
                }
            )

            if(!isAdded){
                return res.status(400).json({ok: false, msg: 'Unable to add link'})
            }

            return res.status(400).json({ok: true, msg: 'Link Added Successfully'})
        }
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}