import express from "express";

// Middlewares
import { isLoggedIn } from "../middleware/isLoggedIn.js";

// Controllers
import { getUserPorifle, updateUserProfile } from "../controller/UserController.js";

// Utils
import { UesrnameValidation } from "../utils/UsernameValidation.js";

const router = express.Router()

// Get User Profile Route: Login Required
router.get('/getuserprofile',isLoggedIn, getUserPorifle )

// Update User Profile Route: Login Required
router.put('/updateprofile/', isLoggedIn, updateUserProfile)

export default router