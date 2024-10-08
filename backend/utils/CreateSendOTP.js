import { Transporter } from './EmailTransporter.js'
import { OTP } from '../models/otp.model.js'
import { configuration } from '../config/config.js'

export const CreateSendOTP = async (email, expiration) => {
    try {
        const otp = Math.floor(Math.random() * 100000)

        const mailOptions = {
            from: process.env.EMAIL, // Sender's name and email
            to: email,              // List of receivers
            subject: 'Email Verification',                           // Subject line
            text: `Email Verification OTP: ${otp}`,                         // Plain text body
        }

        await Transporter.sendMail(mailOptions)
        const expirationTime = Date.now() + parseInt(expiration) * 60 * 1000
        await OTP.create({
            email,
            otp,
            expiration: expirationTime
        })
        return true;
    } catch (error) {
        if(configuration.NODE_ENV == 'development'){
            return console.log('Error from CreateSendOTP: ', error)
        }
        throw new Error('Some error occurred in CreateSendOTP File')
    }
}
