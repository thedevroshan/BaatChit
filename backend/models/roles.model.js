import mongoose from "mongoose";
const { Schema } = mongoose

const rolesSchema = new Schema({
    role: {
        type: String,
        required: true,
        default: 'member'
    },
    color: {
        type: String,
        required: true,
        default:'#FFFFFF',
    },
    message: {
        type:Boolean,
        required: true,
        default: true
    },
    send_files: {
        type: Boolean,
        required: true,
        default: true
    },
    manage_account: {
        type: Boolean,
        required: true,
        default: false,
    },
    private_channel_access: {
        type: Boolean,
        required: true,
        default: false,
    },
    server_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Server',
        required: true
    }
}, {timestamps: true})

export const Role = mongoose.model('Role', rolesSchema)