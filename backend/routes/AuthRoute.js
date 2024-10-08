import express from "express";

const router = express.Router()

// Controllers
import { register, verifyEmail,resendOTP } from '../controller/AuthController.js'

// Utils
import { EmailValidation } from '../utils/EmailValidation.js'
import { PasswordValidation } from '../utils/PasswordValidation.js'
import { UesrnameValidation } from '../utils/UsernameValidation.js'

// Register route
router.post('/register',EmailValidation,PasswordValidation,UesrnameValidation, register)

// Email Verification Route
router.post('/verifyemail', verifyEmail)

// Resend OTP Route
router.post('/resendotp', resendOTP)


export default router;