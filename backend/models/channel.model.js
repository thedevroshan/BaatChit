import mongoose from "mongoose";
const { Schema } = mongoose

const channelSchema = new Schema({
    server_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Server',
        required: true,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    channel_name: {
        type: String,
        required: true,
    },
    allowed_roles: {
        type: [String],
        default: 'member'
    },
    is_private:{
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Channel = mongoose.model('Channel', channelSchema)