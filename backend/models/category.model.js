import mongoose from "mongoose";
const { Schema } = mongoose

const categorySchema = new Schema({
    server_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Server',
        required: true,
    },
    category_name: {
        type: String,
        required: true,
    },
    channels: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Channel',
    }
}, { timestamps: true });

export const Category = mongoose.model('Category', categorySchema)