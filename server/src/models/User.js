import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otpCode: { type: String },       // store hashed OTP? for demo, plain
    otpExpiresAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
