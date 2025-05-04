import mongoose from "mongoose";

// connecting to mongodb database
const connectDB = async () => {
    try {
        // Timeout after 30 seconds instead of the default
        const options = {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 30000,
            maxPoolSize: 100
        }

        await mongoose.connect(process.env.MONGODB_URI, options)
        console.log("Connected to MongoDB")
        return true
    } catch (error) {
        console.error("MongoDB connection error:", error.message)
        throw error
    }
}

export default connectDB;

// Do not use '@' symbol in your databse user's password else it will show an error.