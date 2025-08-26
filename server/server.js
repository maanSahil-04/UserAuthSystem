import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(express.json());

// Middleware example
const requireAuth = (req, res, next) => {
  // Dummy check, later we’ll plug JWT verification
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  next();
};

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/me", requireAuth, (req, res) => {
  res.json({ user: "Test User" });
});

// DB + Server connection
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ DB connection error:", err));
