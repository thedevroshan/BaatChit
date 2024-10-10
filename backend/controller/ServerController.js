// Models
import { Server } from "../models/server.model.js";

export const createServer = async (req, res) => {
    try {
        const {server_name, server_handle} = req.body;

        if(server_name == ''){
            return res.status(400).json({ok: false, msg: 'Server Name is required'})
        }
        
        const isServerHandleExists = await Server.findOne({server_handle})
        if(isServerHandleExists){
            return res.status(400).json({ok: false, msg: 'Server Handle is not available'})
        }

        await Server.create({
            server_name,
            server_handle,
            admin: req.user.id
        })
        res.status(200).json({ok: true, msg: 'Server Created'})
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}