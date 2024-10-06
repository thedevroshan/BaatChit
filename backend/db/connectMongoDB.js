import mongoose from "mongoose";

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Conneted to database')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}