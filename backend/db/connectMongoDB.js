import mongoose from "mongoose";
import { configuration } from "../config/config.js";

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(configuration.MONGO_URL)
        console.log('Conneted to database')
    } catch (error) {
        if(configuration.IS_DEV_ENV){
            console.log(error)
        }
        throw new Error('Unable to connect to database')
    }
}