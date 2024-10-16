// Config
import { configuration } from "../config/config.js";

// Models
import { Category } from "../models/category.model.js";
import { Server } from "../models/server.model.js";

// Create Category
export const createCategory = async (req, res)=>{
    try {
        const {category_name}= req.body;

        const isServerExists = await Server.findOne({server_handle: req.params.server_handle})
        if(!isServerExists){
            return res.status(404).json({ok: false, msg: 'Server Not Found'})
        }

        if(category_name == ''){
            return res.status(400).json({ok: false, msg: 'Category Name is required'})
        }
        
        const isCreated = await Category.create({
            server_id: isServerExists._id,
            category_name
        })

        if(!isCreated){
            return res.status(400).json({ok: false, msg: 'Unable to create category'})
        }

        await isServerExists.updateOne({$push: {categories: isCreated._id}})
        await isServerExists.save()

        res.status(200).json({ok: true, msg: 'Category created successfully'})
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}

// Edit Category Name
export const editCategoryName = async (req,res) => {
    try {
        if(req.body.name == ''){
            return res.status(400).json({ok: false, msg: 'Name is required'})
        }

        const isUpated = await Category.findByIdAndUpdate(req.params.category_id, {
            $set: {
                category_name: req.body.name
            }
        })

        if(!isUpated){
            return res.status(400).json({ok: false, msg: 'Unable to update name'})
        }

        res.status(200).json({ok: true, msg: 'Category name updated successfully'})
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}

// Delete Category
export const deleteCategory = async (req, res) => {
    try {
        const isCategory = await Category.findById(req.params.category_id)
        const isServerUpdated = await Server.findByIdAndUpdate(isCategory.server_id, {
            $pull: {
                categories: isCategory._id
            }
        })

        if(!isServerUpdated){
            return res.status(400).json({ ok: false, msg: 'Unable to delete role' })
        }

        const isDeleted = await Category.findByIdAndDelete(isCategory._id)
        if (!isDeleted) {
            return res.status(400).json({ ok: false, msg: 'Unable to delete role' })
        }
        res.status(400).json({ok: true, msg: 'Category deleted successfully'})
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}

// Delete Category
export const getUserAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({server_id: req.params.server_id})
        if(!categories){
            return res.status(200).json({ok: true, msg: 'No Catgories'})
        }

        res.status(400).json({ok: true, msg: 'Listed All The Categories', data: categories})
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}