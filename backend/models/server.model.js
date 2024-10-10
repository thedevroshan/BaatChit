import mongoose from "mongoose";
const { Schema } = mongoose

const serverSchema = new Schema({
    server_name: {
        type: String,
        required: true
    },
    server_handle: {
        type: String,
        required: true,
    },
    admin: {
        type: String,
        required: true
    },
    channel_groups: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    roles: {
        type: Map,
        of: String,
        default: {
            'member': '#FFFFFF'
        }
    },
    roles_assigned: {
        type: [{
            'userId': String,
            'roles': [String]
        }],
        _id: false
        
    },
    server_icon: {
        type: String
    },
    description: {
        type: String
    },
    links: {
        type: String
    },
}, {timestamps: true})

export const Server = mongoose.model('Server', serverSchema)