import dotenv from 'dotenv'
dotenv.config()

export const configuration = {
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    MONGO_URL: process.env.MONGO_URL,
    LENGHT_OF_PASSWORD: process.env.LENGHT_OF_PASSWORD,
    SALT_LENGHT: process.env.SALT_LENGHT,
    EMAIL: process.env.EMAIL,
    EMAIL_PASS: process.env.EMAIL_PASS,
    OTP_EXPIRATION_MINUTE: process.env.OTP_EXPIRATION_MINUTE
}