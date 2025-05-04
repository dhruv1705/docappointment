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

// Database connection with retry
const connectWithRetry = async () => {
  try {
    await connectDB()
    console.log("MongoDB connected successfully")
    await connectCloudinary()
    console.log("Cloudinary connected successfully")
  } catch (error) {
    console.error("Database connection error:", error)
    console.log("Retrying connection in 5 seconds...")
    setTimeout(connectWithRetry, 5000)
  }
}

connectWithRetry()

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: ['https://docappointment-ecru.vercel.app', 'https://docappointment-admin.vercel.app', 'https://docappointment-backend.vercel.app', 'http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'aToken', 'dToken'],
  credentials: true
}))

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)

app.get("/", (req, res) => {
  res.json({ success: true, message: "API Working" });
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))