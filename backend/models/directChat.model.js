import mongoose from "mongoose";
const { Schema } = mongoose

const directChatSchema = new Schema({
    members:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    }
}, { timestamps: true });

export const DirectChat = mongoose.model('DirectChat', directChatSchema)