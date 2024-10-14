import express from "express";

const router = express.Router()

// Middlewares
import { isLoggedIn } from "../middleware/isLoggedIn.js";

// Controller
import { 
    createCategory
} from "../controller/CategoryController.js";


// Create a Category: Login Required
router.post('/:server_handle/create_category', isLoggedIn, createCategory)



export default router;