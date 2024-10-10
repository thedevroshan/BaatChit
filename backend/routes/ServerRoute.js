import express from "express";

const router = express.Router()

// Middlewares
import { isLoggedIn } from "../middleware/isLoggedIn.js";

// Controller
import { 
    createServer
} from "../controller/ServerController.js";


// Create Server Route: Login Required
router.post('/create_server', isLoggedIn, createServer)

export default router;