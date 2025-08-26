import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendOtpEmail } from "../utils/sendOtp.js";

const router = express.Router();
const OTP_WINDOW_MIN = 10;

function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const otp = genOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_WINDOW_MIN * 60 * 1000);

    const user = await User.create({ email, name, passwordHash, otpCode: otp, otpExpiresAt, isVerified: false });

    await sendOtpEmail({ to: email, otp });

    return res.status(201).json({ message: "Registered. OTP sent to email.", userId: user._id });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /auth/verify-otp
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.json({ message: "Already verified" });

    if (!user.otpCode || !user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      return res.status(400).json({ message: "OTP expired. Please re-register." });
    }
    if (user.otpCode !== otp) return res.status(400).json({ message: "Invalid OTP" });

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return res.json({ message: "Email verified successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    if (!user.isVerified) return res.status(401).json({ message: "Email not verified" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "2h" });
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /auth/me (protected)
router.get("/me", async (req, res) => {
  res.status(404).json({ message: "Use /me on app root with middleware. This route is placeholder." });
});

export default router;
