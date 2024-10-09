// Config File
import { configuration } from "../config/config.js"


// Models
import { User } from "../models/user.model.js"
import { OTP } from "../models/otp.model.js"


// Utils
import { CreateSendOTP } from "../utils/CreateSendOTP.js"


// Get User Profile
export const getUserPorifle = async (req,res) => {
    try {
        const isUserExists = await User.findById(req.user.id).select('-password')
        if(!isUserExists){
            return res.status(404).json({ok: false, msg: 'User not found'})
        }
        res.status(200).json({ok: true, msg: `User Profile of ${isUserExists.username}`, data: isUserExists})
    } catch (error) {
        if(configuration.IS_DEV_ENV){
            return console.log(error)
        }
        throw new Error('Unable to get user profile')
    }
}


// Update User Profile
export const updateUserProfile = async (req, res) => {
    try {
        // User will first request to change the email. Server will sent a otp to change the email
        if(req.query.update == 'change_email_request'){
            const isSent = await CreateSendOTP(null, configuration.OTP_EXPIRATION_MINUTE, 'Email Change', `OTP for changing email. Note this otp will be expired in ${configuration.OTP_EXPIRATION_MINUTE} minute`, req.user.id)
            
            if(!isSent){
                return res.status(400).json({ok: false, msg: 'Unable to send otp'})
            }
            res.status(200).json({ok: true, msg: 'OTP Sent'})
        }

        // Change Email
        if(req.query.update == 'email'){
            const {otp, new_email} = req.body;
            // Validation of email
            if(!new_email.includes('@')){
                return res.status(400).json({ok: false, msg: 'Please enter a valid email'})
            }

            const isOTPExists = await OTP.findOne({otp})
            if(!isOTPExists){
                return res.status(400).json({ok: false, msg: 'Invalid OTP'})
            }

            // Checking whether otp is expired
            if(Date.now() > isOTPExists.expiration){
                await OTP.findOneAndDelete({otp})
                return res.status(400).json({ok: false, msg: 'OTP Expired'})
            }

            // Changing User's email
            await User.findByIdAndUpdate({_id: req.user.id}, {$set: {email: new_email}})
            // Deleting the otp
            await OTP.findOneAndDelete({otp})
            res.status(200).json({ok: true, msg: 'Email Changed Successfully'})
        }

        // Update Name
        if(req.query.update == 'name'){
            const {name} = req.body;
            await User.findByIdAndUpdate(req.user.id, {$set: {name}})
            res.status(200).json({ok: true, msg: 'Name changed successfully'})
        }

        // Update Username
        if(req.query.update == 'username'){
            const {username} = req.body;

            if(username.toLowerCase() !== username){
                return res.status(400).json({ok: false, msg: 'Username must be in lowercase'})
            }

            if(username.includes(' ')){
                return res.status(400).json({ok: false, msg: 'Username must not contain spaces'})
            }    

            const isUserExists = await User.findOne({username})
            if(isUserExists){
                return res.status(400).json({ok: false, msg: 'Username is not available'})
            }
            await User.findByIdAndUpdate(req.user.id, {$set: {username}})
            res.status(200).json({ok: true, msg: 'Username changed successfully'})
        }

        // Update Bio
        if(req.query.update == 'bio'){
            const {bio} = req.body;            
            await User.findByIdAndUpdate(req.user.id, {$set: {bio}})
            res.status(200).json({ok: true, msg: 'Bio changed successfully'})
        }

    } catch (error) {
        if(configuration.IS_DEV_ENV){
            return console.log(error)
        }
        throw new Error('Unable to update user profile')
    }
}