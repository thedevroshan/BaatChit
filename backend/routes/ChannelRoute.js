import express from "express";

const router = express.Router()

// Middlewares
import { isLoggedIn } from "../middleware/isLoggedIn.js";

// Controller
import { 
    addRoles,
    createChannel,
    editChannelName,
    editChannelVisibility,
    removeRole,
    deleteChannel
} from "../controller/ChannelController.js";


// Create a Channel: Login Required
router.post('/create_channel/:category_id', isLoggedIn, createChannel)

// Edit Channel Name: Login Required
router.put('/edit/:channel_id/name', isLoggedIn, editChannelName)

// Edit Channel Visibility: Login Required
router.put('/edit/:channel_id/visibility', isLoggedIn, editChannelVisibility)

// Add Role To Channel: Login Required
router.post('/add/:channel_id/role/:role_id', isLoggedIn, addRoles)

// Remove Role From Channel: Login Required
router.put('/remove/:channel_id/role/:role_id', isLoggedIn, removeRole)

// Delete Role From Channel: Login Required
router.delete('/:channel_id', isLoggedIn, deleteChannel)



export default router;