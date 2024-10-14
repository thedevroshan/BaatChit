import mongoose from "mongoose";
const { Schema } = mongoose;

const serverSchema = new Schema({
    server_name: {
        type: String,
        required: true,
    },
    server_handle: {
        type: String,
        required: true,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Correct use of ref with ObjectId
        required: true,
    },
    categories: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Category', // Correct use of ref with ObjectId
    },
    members: {
        type: [{
            userId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User' // ref should be on userId, which is an ObjectId
            },
            role: [String], // Role can stay as it is, no ref needed
        }],
    },
    roles: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Role'
    },
    server_icon: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    links: {
        type: [{
            name: String,
            url: String,
        }],
    },
}, { timestamps: true });

export const Server = mongoose.model('Server', serverSchema);