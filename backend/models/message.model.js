import mongoose from "mongoose";
const { Schema } = mongoose

const messageSchema = new Schema({
    chat_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message_content_type: {
        type: String,
        required: true,
        enum: ['text','jpeg','png','jpg','pdf','txt']
    },
    message: {
        type: String,
        required: true
    },
    message_type: {
        type: String,
        required: true,
        enum: ['Direct', 'Channel']
    }
}, { timestamps: true });

export const Message = mongoose.model('Message', messageSchema)