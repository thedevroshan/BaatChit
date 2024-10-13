import { configuration } from "../config/config.js";

// Models
import { Server } from "../models/server.model.js";
import { Category } from '../models/category.model.js'
import { Channel } from "../models/channel.model.js"
import { User } from "../models/user.model.js";

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

        const isCreated = await Server.create({
            server_name,
            server_handle,
            admin: req.user.id
        })

        await User.findByIdAndUpdate(req.user.id, {$push: {owned_server: isCreated._id}})

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
        const {name, url, server_handle} = req.body;

        if(name == ''){
            return res.status(400).json({ok: false, msg: 'URL name is required'})
        }

        if(url == ''){
            return res.status(400).json({ok: false, msg: 'URL is required'})
        }

        const isServerExists = await Server.findOne({server_handle})
        if(!isServerExists){
            return res.status(404).json({ok: false, msg:'Server Not Found'})
        }

        const isAdded = await Server.findOneAndUpdate({server_handle}, {$push: {links: {
            name,
            url
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

// Create Role
export const createRole = async (req, res) => {
    try {
        const {server_handle, role, color} = req.body

        const isServerExists = await Server.findOne({server_handle})
        if(!isServerExists){
            return res.status(400).json({ok: false, msg: 'Server Not Found'})
        }

        if(role == '' || color == ''){
            return res.status(400).json({ok: false, msg: 'Role and Color is required'})
        }

        const isRoleCreated = await Server.findOneAndUpdate({server_handle}, {$push: {roles: {role, color}}})
        if(!isRoleCreated){
            return res.status(400).json({ok: false, msg: 'Unable to create role'})
        }
        res.status(200).json({ok: true, msg: 'Role Created Successfully'})
    } catch (error) {
        if (configuration.IS_DEV_ENV) {
            return console.log(error)
        }
        res.status(500).json({ok: false, msg: 'Server Error'})
    }
}

// Create Category
export const createCategory = async (req, res)=>{
    try {
        const {server_handle, category_name}= req.body;

        const isServerExists = await Server.findOne({server_handle})
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

// Create Channel
export const createChannel = async (req, res)=>{
    try {
        const {category_id, channel_name, is_private}= req.body;

        const isCategoryExists = await Category.findById(category_id)
        if(!isCategoryExists){
            return res.status(404).json({ok: false, msg: 'Category Not Found'})
        }

        if(channel_name == ''){
            return res.status(400).json({ok: false, msg: 'Channel Name is required'})
        }
        
        const isCreated = await Channel.create({
            server_id: isCategoryExists.server_id,
            category_id,
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