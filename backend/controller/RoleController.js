//config
import { configuration } from "../config/config.js"

// Models
import { Server } from '../models/server.model.js'
import { Role } from '../models/roles.model.js'

// Create Role
export const createRole = async (req, res) => {
    try {
        const { role, color, private_channel_access, manage_account } = req.body

        if (role == '' || color == '') {
            return res.status(400).json({ ok: true, msg: 'Role and Color are required' })
        }

        const isServerExists = await Server.findOne({server_handle: req.params.server_handle})

        if(!isServerExists){
            return res.status(400).json({oK: false, msg: 'Server Not Found'})
        }

        const isCreated = await Role.create({
            role,
            color,
            server_id: isServerExists._id,
            private_channel_access,
            manage_account       
        })

        if(!isCreated){
            return res.status(400).json({ok: false, msg:'Unable to create role'})
        }

        const isUpdated = await Server.findOneAndUpdate({server_handle: req.params.server_handle},{
            $push: {
                roles: isCreated._id
            }
        })

        if(!isUpdated){
            return res.status(400).json({ok: false, msg: 'Unable to create role'})
        }

        res.status(200).json({ ok: true, msg: 'Role Created Successfully' })
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ ok: false, msg: 'Server Error' })
    }
}

// Edit Role
export const editRole = async (req, res) => {
    try {
        const { role, color, private_channel_access, manage_account } = req.body;

        if (role === '' || color === '') {
            return res.status(400).json({ ok: false, msg: 'Role and Color are required' })
        }

        const isUpdated = await Role.findByIdAndUpdate(req.params.role_id, {
            $set: {
                role,
                color,
                manage_account,
                private_channel_access
            }
        })

        if (!isUpdated) {
            return res.status(400).json({ ok: false, msg: 'Unable to update role' })
        }

        res.status(200).json({ ok: true, msg: 'Role updated successfully' })
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ ok: false, msg: 'Server Error' })
    }
}

// Delete Role
export const deleteRole = async (req, res) => {
    try {
        const isRole = await Role.findById(req.params.role_id)
        const isServerExists = await Server.findByIdAndUpdate(isRole.server_id, {
            $pull: {
                roles: isRole._id
            }
        })

        if(!isServerExists){
            return res.status(400).json({ ok: false, msg: 'Unable to delete role' })
        }

        if(isServerExists){
            const isDeleted = await Role.findByIdAndDelete(isRole._id)
            if (!isDeleted) {
                return res.status(400).json({ ok: false, msg: 'Unable to delete role' })
            }
        }

        res.status(200).json({ ok: true, msg: 'Role deleted successfully' })
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ ok: false, msg: 'Server Error' })
    }
}