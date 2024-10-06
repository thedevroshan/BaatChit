import mongoose from "mongoose";
const { Schema } = mongoose

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    owned_server: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    joined_server: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    friends: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    verfied: {
        type: Boolean,
        default: false
    },
    profile_pic: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    links: {
        type: Map,
        of: String,
        default: {}
    }
}, {timestamps: true})

export const User = mongoose.model('User', userSchema)