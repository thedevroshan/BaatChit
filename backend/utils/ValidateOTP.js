import { OTP } from "../models/otp.model.js"

export const ValidateOTP = async (otp) => {
    try {
        const isOTPExists = await OTP.findOne({ otp })
        if (!isOTPExists) {
            return {
                ok: false,
                msg: 'Invalid OTP'
            }
        }

        // Checking whether otp is expired
        if (Date.now() > isOTPExists.expiration) {
            await OTP.findOneAndDelete({ otp })
            return {
                ok: false,
                msg: 'OTP Expired'
            }
        }

        await OTP.findOneAndDelete({otp})
        return {
            ok: true,
            msg: 'OTP Validated',
            user: isOTPExists.email
        }
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        throw new Error('Unable to validate otp')
    }
}