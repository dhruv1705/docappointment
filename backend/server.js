import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000

console.log("Starting server...")
console.log("MongoDB URI:", process.env.MONGODB_URI ? "Available" : "Missing")
console.log("Cloudinary credentials:", process.env.CLOUDINARY_NAME ? "Available" : "Missing")

// Database connection with retry
const connectWithRetry = async () => {
  try {
    console.log("Attempting to connect to MongoDB...")
    await connectDB()
    console.log("MongoDB connected successfully")
    
    console.log("Attempting to connect to Cloudinary...")
    await connectCloudinary()
    console.log("Cloudinary connected successfully")
  } catch (error) {
    console.error("Database connection error:", error.message)
    console.log("Retrying connection in 5 seconds...")
    setTimeout(connectWithRetry, 5000)
  }
}

// Wrap server startup in a try/catch
try {
  // middlewares
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cors({
    origin: ['https://docappointment-ecru.vercel.app', 'https://docappointment-admin.vercel.app', 'https://docappointment-backend.vercel.app', 'http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'aToken', 'dToken'],
    credentials: true
  }))

  // Connect to databases before setting up routes
  await connectWithRetry()

  // api endpoints
  app.use("/api/user", userRouter)
  app.use("/api/admin", adminRouter)
  app.use("/api/doctor", doctorRouter)

  app.get("/", (req, res) => {
    res.json({ success: true, message: "API Working", env: process.env.NODE_ENV });
  });

  app.listen(port, () => console.log(`Server started on PORT:${port}`))
} catch (error) {
  console.error("Server startup error:", error)
}