import express from "express";

const router = express.Router()

// Middlewares
import { isLoggedIn } from "../middleware/isLoggedIn.js";

// Controller
import { 
    createRole,
    editRole,
    deleteRole
} from "../controller/RoleController.js";


// Create a Role Route: Login Required
router.post('/:server_handle/create_role', isLoggedIn, createRole)

// Edit a Role Route: Login Required
router.put('/edit/:role_id', isLoggedIn, editRole)

// Delete Role Route: Login Required
router.delete('/:role_id', isLoggedIn, deleteRole)



export default router;