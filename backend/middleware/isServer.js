// config
import { configuration } from '../config/config.js'

// Models
import { Server } from '../models/server.model.js'

export const isServer = async (req, res, next) => {
    try {
        const isServerExist = await Server.findOne({server_handle: req.params.server_handle})
        if(!isServerExist){
            return res.status(404).json({ok: false, msg: 'Server Not Found'})
        }
        req.server = {
            isServerExist
        }
        next()
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}