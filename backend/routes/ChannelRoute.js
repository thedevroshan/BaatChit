import express from "express";

const router = express.Router()

// Middlewares
import { isLoggedIn } from "../middleware/isLoggedIn.js";

// Controller
import { 
    createChannel,
    editChannelName,
    editChannelVisibility
} from "../controller/ChannelController.js";


// Create a Category: Login Required
router.post('/create_channel/:category_id', isLoggedIn, createChannel)

// Edit Channel Name: Login Required
router.put('/edit/:channel_id/name', isLoggedIn, editChannelName)

// Edit Channel Visibility: Login Required
router.put('/edit/:channel_id/visibility', isLoggedIn, editChannelVisibility)



export default router;