import mongoose from "mongoose";
const { Schema } = mongoose

const friendRequestSchema = new Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true })

export const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema)