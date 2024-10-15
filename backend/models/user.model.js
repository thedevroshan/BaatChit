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
    verified: {
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
        type: [{
            url_name: String,
            url: String
        }]
    }
}, {timestamps: true})

export const User = mongoose.model('User', userSchema)