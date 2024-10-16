import { configuration } from "../config/config.js";

// Models
import { Server } from "../models/server.model.js";
import { User } from "../models/user.model.js";
import { Role } from '../models/roles.model.js'
import { Category } from '../models/category.model.js'
import { Channel } from '../models/channel.model.js'

// Utils
import { CreateSendOTP } from '../utils/CreateSendOTP.js'
import { ValidateOTP } from '../utils/ValidateOTP.js'


// Create Server
export const createServer = async (req, res) => {
    try {
        const { server_name, server_handle } = req.body;

        // Return if server_name is empty
        if (server_name == '') {
            return res.status(400).json({ ok: false, msg: 'Server Name is required' })
        }

        // Return If new server_handle already exists
        const isServerHandleExists = await Server.findOne({ server_handle })
        if (isServerHandleExists) {
            return res.status(400).json({ ok: false, msg: 'Server Handle is not available' })
        }

        // Create Server
        const isCreated = await Server.create({
            server_name,
            server_handle,
            admin: req.user.id,
        })

        // Push the id of server to the owned_server array of user
        await User.findByIdAndUpdate(req.user.id, { $push: { owned_server: isCreated._id } })

        // Create the default role 'member'
        const role = await Role.create({
            server_id: isCreated._id,
        })

        // Push the id of the default role to the roles array of the server
        isCreated.roles.push(role._id)
        await isCreated.save()

        // Return With Ok
        res.status(200).json({ ok: true, msg: 'Server Created' })
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ ok: false, msg: 'Server Error' })
    }
}

// Update Server Name
export const updateName = async (req, res) => {
    try {
        const { server_name } = req.body;

        // Return if server not exists
        const isServerExists = await Server.findOne({ server_handle: req.params.server_handle })
        if (!isServerExists) {
            return res.status(400).json({ ok: false, msg: 'Server not found' })
        }

        // Return if server_name is empty
        if (server_name == '') {
            return res.status(400).json({ ok: false, msg: 'Server Name is required' })
        }


        // Find and the server and update it's name
        const isUpdated = await Server.findOneAndUpdate({ server_handle: req.params.server_handle }, { $set: { server_name } })

        // Return if updation failed
        if (!isUpdated) {
            return res.status(400).json({ ok: false, msg: 'Unable to update name' })
        }
        res.status(200).json({ ok: true, msg: 'Server Name Updated' })
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ ok: false, msg: 'Server Error' })
    }
}


// Update Server Handle Request. Server will send a otp to the email of the user for confirmation and security purposes
export const updateHandleRequest = async (req, res) => {
    try {
        await CreateSendOTP(null, configuration.OTP_EXPIRATION_MINUTE, 'Username Change', `Here is the otp to change your server handle. Note this otp will be expired in ${configuration.OTP_EXPIRATION_MINUTE} minute`, req.user.id)
        res.status(200).json({ ok: true, msg: 'We have send you the otp to change your server handle.Check your spam or inbox folder' })
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ ok: false, msg: 'Server Error' })
    }
}


// Update Server Handle
export const updateHandle = async (req, res) => {
    try {
        const { otp, new_server_handle } = req.body;

        // Return if new server_handle is not available means there is already a server with that server_handle
        const isServerExists = await Server.findOne({ server_handle: new_server_handle })
        if (isServerExists) {
            return res.status(400).json({ ok: false, msg: 'Server Handle Not Available' })
        }

        // Return if server doesn't exist. If user req.params.server_handle doesn't exist in the database.
        if (!await Server.findOne({ server_handle: req.params.server_handle })) {
            return res.status(404).json({ ok: false, msg: 'Server Not Found' })
        }

        // Validate the otp
        const isValidated = await ValidateOTP(otp)

        // Return if OTP validation failed
        if (!isValidated.ok) {
            return res.status(400).json({ ok: false, msg: isValidated.msg })
        }

        // Return if new_server_handle is empty
        if (new_server_handle == '') {
            return res.status(400).json({ ok: false, msg: 'Server Handle is required' })
        }

        /// Find the server and update it's server_handle
        const isUpdated = await Server.findOneAndUpdate({ server_handle: req.params.server_handle }, { $set: { server_handle: new_server_handle } })

        // If updation failed
        if (!isUpdated) {
            return res.status(400).json({ ok: false, msg: 'Unable to update server_handle' })
        }

        res.status(200).json({ ok: true, msg: 'Server Handle Changed Successfully' })
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ ok: false, msg: 'Server Error' })
    }
}

// Update Description
export const updateDescription = async (req, res) => {
    try {
        const { description } = req.body;

        const isServerExists = await Server.findOne({ server_handle: req.params.server_handle })
        if (!isServerExists) {
            return res.status(400).json({ ok: false, msg: 'Server not found' })
        }

        if (description == '') {
            return res.status(400).json({ ok: false, msg: 'Description is required' })
        }

        await Server.findOneAndUpdate({ server_handle: req.params.server_handle }, { $set: { description } })

        res.status(200).json({ ok: true, msg: 'Server Description Changed Successfully' })
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ ok: false, msg: 'Server Error' })
    }
}

// Add Server Links
export const addServerLinks = async (req, res) => {
    try {
        const { name, url } = req.body;

        if (name == '') {
            return res.status(400).json({ ok: false, msg: 'URL name is required' })
        }

        if (url == '') {
            return res.status(400).json({ ok: false, msg: 'URL is required' })
        }

        const isServerExists = await Server.findOne({ server_handle: req.params.server_handle })
        if (!isServerExists) {
            return res.status(404).json({ ok: false, msg: 'Server Not Found' })
        }

        const isAdded = await Server.findOneAndUpdate({ server_handle: req.params.server_handle }, {
            $push: {
                links: {
                    name,
                    url
                }
            }
        })

        if (!isAdded) {
            return res.status(400).json({ ok: false, msg: 'Unable to add link' })
        }

        res.status(200).json({ ok: true, msg: 'Links Added Successfully' })

    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ ok: false, msg: 'Server Error' })
    }
}

// Edit Server Links
export const editServerLinks = async (req, res) => {
    try {
        const { name, url } = req.body;

        if (name == '' || url == "") {
            return res.status(400).json({ ok: false, msg: 'Name and Url is required' })
        }

        const isServerExists = await Server.findOne({ server_handle: req.params.server_handle })
        if (!isServerExists) {
            return res.status(404).json({ ok: false, msg: 'Server Not Found' })
        }

        const isUpdated = await Server.findOneAndUpdate(
            { server_handle: req.params.server_handle, 'links._id': req.params.link_id }, // Find server and specific link by link's _id
            {
                $set: {
                    'links.$.name': name,  // Update name
                    'links.$.url': url,    // Update url
                }
            },
            { new: true }
        );

        if (!isUpdated) {
            return res.status(400).json({ ok: false, msg: 'Unable to update link' })
        }

        res.status(400).json({ ok: true, msg: 'Link Updated Successfully' })
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ ok: false, msg: 'Server Error' })
    }
}

// Delete Link
export const deleteLink = async (req, res) => {
    try {
        const isDeleted = await Server.findOneAndUpdate({ server_handle: req.params.server_handle }, {
            $pull: {
                'links': {
                    _id: req.params.link_id
                }
            }
        })

        if (!isDeleted) {
            res.status(400).json({ ok: false, msg: 'Unable to delete link' })
        }

        res.status(200).json({ ok: true, msg: 'Link deleted successfully' })
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ ok: false, msg: 'Server Error' })
    }
}

// Delete Server
export const deleteServer = async (req, res) => {
    try {
        const server = await Server.findOne({ server_handle: req.params.server_handle })

        if (!server) {
            return res.status(404).json({ ok: false, msg: 'Server Not Found' })
        }

        const isChannels = await Channel.find({server_id: server._id})
        if (isChannels) {
            await Channel.deleteMany({ server_id: server._id })
        }

        if(server.categories.length > 0){
            await Category.deleteMany({ server_id: server._id })
        }

        if (server.roles.length > 0) {
            await Role.deleteMany({ server_id: server._id })
        }

        if (server.members.length > 0) {
            await User.updateMany(
                { joined_server: { $in: server._id } },
                {
                    $pull: {
                        joined_server: server._id
                    }
                }
            )
        }

        const isUser = await User.findById(server.admin)
        if (!isUser) {
            return res.status(404).json({ ok: false, msg: 'User Not Found' })
        }

        await User.updateOne(
            { _id: server.admin },
            {
                $pull: {
                    owned_server: server._id
                }
            }
        )

        const isServerDeleted = await Server.deleteOne({ _id: server._id })
        if (!isServerDeleted) {
            return res.status(400).json({ ok: false, msg: 'Unable to delete server' })
        }

        res.status(200).json({ ok: true, msg: 'Server Deleted Successfully' })
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ ok: false, msg: 'Server Error' })
    }
}

// Get Server
export const getUserAllServer = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if(user.owned_server.length == 0){
            return res.status(200).json({ok: true, msg: 'No Servers'})
        }

        const servers = []
        await Promise.all(user.owned_server.map(async (server)=>{
            const isServer = await Server.findById(server)
            if(!isServer){
                return res.status(404).json({ok: false, msg: 'Server Not Found'})
            }

            servers.push(isServer)
        }))

        res.status(200).json({ok: true, msg: 'Listed All The Servers', data: servers})
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ ok: false, msg: 'Server Error' })
    }
}