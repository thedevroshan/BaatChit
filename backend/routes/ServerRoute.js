import express from "express";

const router = express.Router()

// Middlewares
import { isLoggedIn } from "../middleware/isLoggedIn.js";

// Controller
import { 
    createServer,
    updateName,
    updateDescription,
    updateHandle,
    updateHandleRequest,
    addServerLinks,
    createRole,
    createCategory,
    createChannel
} from "../controller/ServerController.js";


// Create Server Route: Login Required
router.post('/create_server', isLoggedIn, createServer)

// Update Server Name Route: Login Required
router.put('/update/name', isLoggedIn, updateName)

// Update Server Description Route: Login Required
router.put('/update/description', isLoggedIn, updateDescription)

// Update Server Handle Request Route: Login Required
router.put('/update/handle_request', isLoggedIn, updateHandleRequest)

// Update Server Handle Route: Login Required
router.put('/update/handle', isLoggedIn, updateHandle)

// Add Server Links Route: Login Required
router.post('/add/links', isLoggedIn, addServerLinks)

// Create a Role: Login Required
router.post('/create_role', isLoggedIn, createRole)

// Create a Category: Login Required
router.post('/create_category', isLoggedIn, createCategory)

// Create a Channel: Login Required
router.post('/create_channel', isLoggedIn, createChannel)


export default router;