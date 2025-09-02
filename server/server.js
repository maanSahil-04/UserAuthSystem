import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./src/routes/auth.js";
import { requireAuth } from "./src/middleware/auth.js";
import User from "./src/models/User.js";
import {sendOtpEmail} from "./src/utils/sendOtp.js";
import jwt from "jsonwebtoken";
import cors from "cors";


dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/auth", authRoutes);



app.post("/send-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const info = await sendOtpEmail({ to: email, otp });
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});



// ------------------ USER MODEL ------------------
//const userSchema = new mongoose.Schema({
//  name: { type: String, required: true },
  //email: { type: String, required: true, unique: true },
  //password: { type: String, required: true },
//});

//const User = mongoose.model("User", userSchema);

// ------------------ MIDDLEWARE ------------------
//const requireAuth = (req, res, next) => {
//  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
//  if (!token) return res.status(401).json({ error: "Unauthorized: No token" });

//  try {
//    const decoded = jwt.verify(token, process.env.JWT_SECRET);
//    req.user = decoded;
//    next();
//  } catch (err) {
//    return res.status(401).json({ error: "Invalid token" });
//  }
//};

// ------------------ ROUTES ------------------

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Protected Route
app.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ user });
});

// ------------------ DB + SERVER ------------------
const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
  )
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ DB connection error:", err));
