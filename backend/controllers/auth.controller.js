import User  from "../models/user.model.js";
import { generateToken } from "../config/jwtProvider.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";

dotenv.config();

export const register = async (req, res, next) => {
  const { username, email } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Create new user if email doesn't exist
    const newUser = new User({
      username,
      email,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log("Error while registering users:", error);
    next(error); // Pass error to error-handling middleware
  }
};


// Temporary storage for OTPs - use a real cache like Redis in production
const otpStore = {};

export const login = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!otp) {
      // Use crypto to generate a random 6-digit OTP
      const generatedOtp = crypto.randomBytes(3).toString("hex").toUpperCase(); // Generates a 6-character string
      console.log("Generated OTP:", generatedOtp);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.APP_EMAIL,
          pass: process.env.APP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.APP_EMAIL,
        to: user.email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${generatedOtp}`,
      });

      otpStore[email] = {
        code: generatedOtp,
        expiresAt: Date.now() + 300000, // OTP expires in 5 minutes
      };

      return res.status(200).json({ message: "OTP sent to email" });
    }

    const storedOtpData = otpStore[email];
    if (!storedOtpData) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (storedOtpData.code !== otp || storedOtpData.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    delete otpStore[email];

    const token = generateToken(user._id);
    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.error("Error during login process:", error);
    next(error);
  }
};
