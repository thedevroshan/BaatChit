import express from "express";

const router = express.Router()

// Middlewares
import { isLoggedIn } from "../middleware/isLoggedIn.js";

// Controller
import { 
    createCategory,
    editCategoryName,
    deleteCategory,
    getUserAllCategories
} from "../controller/CategoryController.js";


// Create a Category: Login Required
router.post('/:server_handle/create_category', isLoggedIn, createCategory)

// Edit name of category route: Login Required
router.put('/edit/:category_id/name', isLoggedIn, editCategoryName)

// Delete Category Route: Login Required
router.delete('/:category_id', isLoggedIn, deleteCategory)

// Get User All Categories
router.get('/:server_id/getuserallcategories', isLoggedIn, getUserAllCategories)


export default router;