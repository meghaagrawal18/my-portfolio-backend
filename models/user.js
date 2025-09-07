const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },  // only for email login
    otp: { type: String },       // store OTP temporarily
    otpExpiry: { type: Date },
    provider: { type: String, default: "local" }, // "google", "github", etc.
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
