import express from "express";

const router = express.Router()

// Controllers
import { register } from '../controller/AuthController.js'

// Utils
import { EmailValidation } from '../utils/EmailValidation.js'
import { PasswordValidation } from '../utils/PasswordValidation.js'
import { UesrnameValidation } from '../utils/UsernameValidation.js'

// Register route
router.post('/register',EmailValidation,PasswordValidation,UesrnameValidation, register)


export default router;