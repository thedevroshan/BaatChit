import express from "express";

// Middlewares
import { isLoggedIn } from "../middleware/isLoggedIn.js";

// Controllers
import { 
    getUserPorifle, 
    updateEmail, 
    updateName, 
    updateUsername, 
    updateBio, 
    updatePassword,
    forgetPassword,
    resetPassword
} from "../controller/UserController.js";

// Uitls
import { EmailValidation } from '../utils/EmailValidation.js'
import { UesrnameValidation } from '../utils/UsernameValidation.js'
import { PasswordValidation } from '../utils/PasswordValidation.js'


const router = express.Router()

// Get User Profile Route: Login Required
router.get('/getuserprofile',isLoggedIn, getUserPorifle )

// Update User Profile Route: Login Required
router.put('/updateprofile/',EmailValidation, isLoggedIn, updateEmail)

// Update User Profile Route: Login Required
router.put('/updateprofile/username',UesrnameValidation, isLoggedIn, updateUsername)

// Update User Profile Route: Login Required
router.put('/updateprofile/name', isLoggedIn, updateName)

// Update User Profile Route: Login Required
router.put('/updateprofile/bio', isLoggedIn, updateBio)

// Update User Profile Route: Login Required
router.put('/updateprofile/password',PasswordValidation, isLoggedIn, updatePassword)

// Forget Password: No Login Required
router.post('/forgetpassword', forgetPassword)

// Reset Password: No Login Required
router.put('/resetpassword',PasswordValidation, resetPassword)

export default router