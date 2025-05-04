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

console.log("Starting server with Node version:", process.version)
console.log("MongoDB URI:", process.env.MONGODB_URI ? "Available" : "Missing")
console.log("Cloudinary credentials:", process.env.CLOUDINARY_NAME ? "Available" : "Missing")

// Database connection - no async/await at the top level for serverless compatibility
let isConnected = false

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: ['https://docappointment-ecru.vercel.app', 'https://docappointment-admin.vercel.app', 'https://docappointment-backend.vercel.app', 'http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'aToken', 'dToken'],
  credentials: true
}))

// Handle database connection at request time if not already connected
const connectWithRetry = async () => {
  if (!isConnected) {
    try {
      console.log("Attempting to connect to MongoDB...")
      await connectDB()
      console.log("MongoDB connected successfully")
      
      console.log("Attempting to connect to Cloudinary...")
      await connectCloudinary()
      console.log("Cloudinary connected successfully")
      
      isConnected = true
    } catch (error) {
      console.error("Database connection error:", error.message)
      throw error // Propagate error to be handled by route handlers
    }
  }
}

// Middleware to ensure database connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectWithRetry()
    next()
  } catch (error) {
    console.error("Failed to connect to database:", error)
    res.status(500).json({ 
      success: false, 
      message: "Server configuration error, please try again later",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)

app.get("/", (req, res) => {
  res.json({ 
    success: true, 
    message: "API Working", 
    environment: process.env.NODE_ENV,
    connections: {
      database: isConnected ? "Connected" : "Not connected"
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ 
    success: false, 
    message: "An unexpected error occurred",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// For local development - not used in Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`Server started on PORT:${port}`))
}

// Export for serverless environment
export default app