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