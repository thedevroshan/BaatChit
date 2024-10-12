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
        default: [{
            'role': String,
            'color': String
        }],
        _id: false,
        default: {
            'role': 'member',
            'color': '#FFFFFF'
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
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    links: {
        type: [{
            'name': String,
            'url': String
        }],
        _id: false,
    },
}, {timestamps: true})

export const Server = mongoose.model('Server', serverSchema)