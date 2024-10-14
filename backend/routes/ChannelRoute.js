import express from "express";

const router = express.Router()

// Middlewares
import { isLoggedIn } from "../middleware/isLoggedIn.js";

// Controller
import { 
    createChannel
} from "../controller/ChannelController.js";


// Create a Category: Login Required
router.post('/:category_id/create_channel', isLoggedIn, createChannel)



export default router;