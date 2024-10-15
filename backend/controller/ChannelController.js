// Config
import { configuration } from "../config/config.js";

// Models
import { Category } from "../models/category.model.js";
import { Channel } from "../models/channel.model.js";
import { Role } from '../models/roles.model.js'

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

        const memberRole = await Role.findOne({server_id: isCategoryExists.server_id, role: 'member'})

        const isCreated = await Channel.create({
            server_id: isCategoryExists.server_id,
            category_id: req.params.category_id,
            channel_name,
            allowed_roles: is_private?[]:[memberRole._id],
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

// Add Roles
export const addRoles = async (req, res) => {
    try {
        const isChannel = await Channel.findById(req.params.channel_id)
        if(!isChannel){
            return res.status(400).json({ok: false, msg: 'Channel Not Found'})
        }

        const isRole = await Role.findById(req.params.role_id)
        if(!isRole){
            return res.status(400).json({ok: false, msg: 'Role Not Found'})
        }

        if(isChannel.is_private && !isRole.private_channel_access){
            return res.status(400).json({ok: false, msg: `${isRole.role} has not the permission to access private channels`})
        }

        isChannel.allowed_roles.push(isRole._id)
        await isChannel.save()

        res.status(200).json({ok: true, msg: 'Role added successfully'})
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ ok: false, msg: 'Server Error' })
    }
}

// Remove Role
export const removeRole = async (req, res) => {
    try {
        const isChannel = await Channel.findById(req.params.channel_id)
        if(!isChannel){
            return res.status(400).json({ok: false, msg: 'Channel Not Found'})
        }

        const isRole = await Role.findById(req.params.role_id)
        if(!isRole){
            return res.status(400).json({ok: false, msg: 'Role Not Found'})
        }

        isChannel.allowed_roles.pull(isRole._id)
        await isChannel.save()

        res.status(400).json({ok: true, msg: 'Role removed successfully'})
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ ok: false, msg: 'Server Error' })
    }
}

// Delete Channel
export const deleteChannel = async (req, res) => {
    try {
        const isChannel = await Channel.findById(req.params.channel_id)

        const isCategoryExists = await Category.findByIdAndUpdate(isChannel.category_id, {
            $pull: {
                channels: isChannel._id
            }
        })

        if(!isCategoryExists){
            return res.status(400).json({ok: false, msg: 'Unable to delete channel'})
        }

        const isDeleted = await Channel.findByIdAndDelete(isChannel._id)
        if(!isDeleted){
            return res.status(400).json({ok: false, msg: 'Unable to delete channel'})
        }

        res.status(400).json({ok: true, msg: 'Channel deleted successfully'})
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ ok: false, msg: 'Server Error' })
    }
}