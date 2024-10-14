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
    editServerLinks,
    deleteLink
} from "../controller/ServerController.js";


// Create Server Route: Login Required
router.post('/create_server', isLoggedIn, createServer)

// Update Server Name Route: Login Required
router.put('/edit/:server_handle/name', isLoggedIn, updateName)

// Update Server Description Route: Login Required
router.put('/edit/:server_handle/description', isLoggedIn, updateDescription)

// Update Server Handle Request Route: Login Required
router.put('/edit/:server_handle/handle_request', isLoggedIn, updateHandleRequest)

// Update Server Handle Route: Login Required
router.put('/edit/:server_handle/handle', isLoggedIn, updateHandle)

// Add Server Links Route: Login Required
router.post('/add/:server_handle/links', isLoggedIn, addServerLinks)

// Edit Links Route: Login Required
router.put('/edit/:server_handle/link/:link_id', isLoggedIn, editServerLinks)

// Delete Server Link Route: Login Required
router.delete('/:server_handle/link/:link_id', isLoggedIn, deleteLink)

export default router;