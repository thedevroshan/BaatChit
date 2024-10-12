import { configuration } from "../config/config.js";

// Models
import { Server } from "../models/server.model.js";

// Utils
import { CreateSendOTP } from '../utils/CreateSendOTP.js'
import { ValidateOTP } from '../utils/ValidateOTP.js'


// Create Server
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

// Update Server Name
export const updateName = async (req, res) => {
    try {
        const {server_name, server_handle} = req.body;
        
        const isServerExists = await Server.findOne({server_handle})
        if(!isServerExists){
            return res.status(400).json({ok: false, msg: 'Server not found'})
        }

        if(server_name == ''){
            return res.status(400).json({ok: false, msg: 'Server Name is required'})
        }


        await Server.findOneAndUpdate({server_handle},{$set: {server_name}})
        
        res.status(200).json({ok: true, msg: 'Server Name Updated'})
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}


// Update Server Handle Request
export const updateHandleRequest = async (req, res) => {
    try {
        await CreateSendOTP(null, configuration.OTP_EXPIRATION_MINUTE, 'Username Change', `Here is the otp to change your server handle. Note this otp will be expired in ${configuration.OTP_EXPIRATION_MINUTE} minute`, req.user.id)
        res.status(200).json({ok: true, msg: 'We have send you the otp to change your server handle.Check your spam or inbox folder'})
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}


// Update Server Handle
export const updateHandle = async (req, res) => {
    try {
        const {otp, server_handle, new_server_handle} = req.body;

        const isServerExists = await Server.findOne({server_handle: new_server_handle})
        if(isServerExists){
            return res.status(400).json({ok: false, msg: 'Server Handle Not Available'})
        }

        if(!await Server.findOne({server_handle})){
            return res.status(404).json({ok: false, msg: 'Server Not Found'})
        }

        const isValidated = await ValidateOTP(otp)
        
        if(!isValidated.ok){
            return res.status(400).json({ok: false, msg: isValidated.msg})
        }

        if(new_server_handle == ''){
            return res.status(400).json({ok: false, msg: 'Server Handle is required'})
        }
        
        await Server.findOneAndUpdate({server_handle}, {$set: {server_handle: new_server_handle}})
        res.status(200).json({ok: true, msg: 'Server Handle Changed Successfully'})
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}

// Update Description
export const updateDescription = async (req, res) => {
    try {
        const {server_handle, description} = req.body;

        const isServerExists = await Server.findOne({server_handle})
        if(!isServerExists){
            return res.status(400).json({ok: false, msg: 'Server not found'})
        }
        
        if(description == ''){
            return res.status(400).json({ok: false, msg: 'Description is required'})
        }

        await Server.findOneAndUpdate({server_handle},{$set: {description}})
        
        res.status(200).json({ok: true, msg: 'Server Description Changed Successfully'})
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}

// Add Server Links
export const addServerLinks = async (req, res) => {
    try {
        const {linkObject, server_handle} = req.body;

        if(linkObject.name == ''){
            return res.status(400).json({ok: false, msg: 'URL name is required'})
        }

        if(linkObject.url == ''){
            return res.status(400).json({ok: false, msg: 'URL is required'})
        }

        const isServerExists = await Server.findOne({server_handle})
        if(!isServerExists){
            return res.status(404).json({ok: false, msg:'Server Not Found'})
        }

        const isAdded = await Server.findOneAndUpdate({server_handle}, {$push: {links: {
            name: linkObject.name,
            url: linkObject.url
        }}})

        if(!isAdded){
            return res.status(400).json({ok: false, msg: 'Unable to add link'})
        }

        res.status(200).json({ok: true, msg: 'Links Added Successfully'})

    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}