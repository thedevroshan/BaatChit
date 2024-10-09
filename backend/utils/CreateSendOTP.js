import { Transporter } from './EmailTransporter.js'
import { OTP } from '../models/otp.model.js'
import { configuration } from '../config/config.js'
import { User } from '../models/user.model.js'

export const CreateSendOTP = async (email, expiration, subject, text, userId) => {
    try {
        const otp = Math.floor(10000 + Math.random() * 90000)

        // This will work when the email provided and userId
        if (userId == null && email != null) {
            const isSent = await SendMail(email, subject, text, expiration, otp)
            return isSent?true:false;
        }

        // This will work when there some situation where it's difficult to access user email but if the user is logged-in then by it's userId we will find it's email
        if (userId != null && email == null) {
            const user = await User.findById(userId)
            const isSent = await SendMail(user.email, subject, text, expiration, otp)
            return isSent?true:false;
        }
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log('Error from CreateSendOTP(CreateSendOTP): ', error)
        }
        throw new Error('Some error occurred in CreateSendOTP File')
    }
}


const SendMail = async (email, subject, text,expiration, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL, // Sender's name and email
            to: email,              // List of receivers
            subject: subject,                           // Subject line
            text: `${text}: ${otp}`,                         // Plain text body
        }

        const isSent = await Transporter.sendMail(mailOptions)
        const expirationTime = Date.now() + parseInt(expiration) * 60 * 1000
        const isCreated = await OTP.create({
            email,
            otp,
            expiration: expirationTime
        })
        if (isSent && isCreated) {
            return true;
        }
        return false
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log('Error from CreateSendOTP(SendMail): ', error)
        }
        throw new Error('Some error occurred in CreateSendOTP File')
    }
}
