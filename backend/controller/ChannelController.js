// Config
import { configuration } from "../config/config.js";

// Models
import { Category } from "../models/category.model.js";
import { Channel } from "../models/channel.model.js";

// Create Channel
export const createChannel = async (req, res) => {
    try {
        const { channel_name, is_private } = req.body;

        const isCategoryExists = await Category.findById(req.params.category_id)
        if (!isCategoryExists) {
            return res.status(404).json({ ok: false, msg: 'Category Not Found' })
        }

        if (channel_name == '') {
            return res.status(400).json({ ok: false, msg: 'Channel Name is required' })
        }

        const isCreated = await Channel.create({
            server_id: isCategoryExists.server_id,
            category_id: req.params.category_id,
            channel_name,
            allowed_roles: is_private?'':'member',
            is_private
        })

        if (!isCreated) {
            return res.status(400).json({ ok: false, msg: 'Unable to create channel' })
        }

        await isCategoryExists.updateOne({ $push: { channels: isCreated._id } })
        await isCategoryExists.save()

        res.status(200).json({ ok: true, msg: 'Channel created successfully' })
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ ok: false, msg: 'Server Error' })
    }
}

// Edit Channel Name
export const editChannelName = async (req,res) =>{
    try {
        if(req.body.name == ''){
            return res.status(400).json({ok: false, msg: 'Name is required'})
        }

        const isUpdated = await Channel.findByIdAndUpdate(req.params.channel_id, {
            $set: {
                channel_name: req.body.name
            }
        })

        if(!isUpdated){
            return res.status(400).json({ok: false, msg: 'Unable to update name'})
        }

        res.status(200).json({ok: true, msg:'Name updated successfully'})
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ ok: false, msg: 'Server Error' })
    }
}

// Edit Channel Name
export const editChannelVisibility = async (req,res) =>{
    try {
        if(typeof req.body.is_private !== 'boolean'){
            return res.status(400).json({ok: false, msg: 'Is Private can only be true or false'})
        }

        const isUpdated = await Channel.findByIdAndUpdate(req.params.channel_id, {
            $set: {
                is_private: req.body.is_private
            }
        })

        if(!isUpdated){
            return res.status(400).json({ok: false, msg: 'Unable to update visibility'})
        }

        res.status(200).json({ok: true, msg:'Channel Visibility updated successfully'})
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ ok: false, msg: 'Server Error' })
    }
}