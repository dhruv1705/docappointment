import mongoose from "mongoose";

// connecting to mongodb database
const connectDB = async () => {
    try {
        // Add the database name if not in the URI already
        const uri = process.env.MONGODB_URI;
        const dbName = "/prescripto";
        
        // Check if URI already has a database path
        const connectionString = uri.includes("mongodb+srv://") && !uri.endsWith("/") && !uri.includes("/?") && !uri.includes("/prescripto") 
            ? `${uri}${dbName}` 
            : uri;
        
        console.log("Connection string created (masked):", connectionString.replace(/\/\/([^:]+):[^@]+@/, "//***:***@"));
        
        // Timeout after 30 seconds instead of the default
        const options = {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 30000,
            maxPoolSize: 100
        }

        await mongoose.connect(connectionString, options);
        console.log("Connected to MongoDB");
        return true;
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        console.error("Full error stack:", error.stack);
        throw error;
    }
}

export default connectDB;

// Do not use '@' symbol in your databse user's password else it will show an error.