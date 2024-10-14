// Config
import { configuration } from "../config/config.js";

// Models
import { Category } from "../models/category.model.js";
import { Channel } from "../models/channel.model.js";

// Create Channel
export const createChannel = async (req, res)=>{
    try {
        const {channel_name, is_private}= req.body;

        const isCategoryExists = await Category.findById(req.params.category_id)
        if(!isCategoryExists){
            return res.status(404).json({ok: false, msg: 'Category Not Found'})
        }

        if(channel_name == ''){
            return res.status(400).json({ok: false, msg: 'Channel Name is required'})
        }
        
        const isCreated = await Channel.create({
            server_id: isCategoryExists.server_id,
            category_id: req.params.category_id,
            channel_name,
            is_private
        })

        if(!isCreated){
            return res.status(400).json({ok: false, msg: 'Unable to create channel'})
        }

        await isCategoryExists.updateOne({$push: {channels: isCreated._id}})
        await isCategoryExists.save()

        res.status(200).json({ok: true, msg: 'Category created successfully'})
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}