import userModel from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserDashboardData } from "../utils/userUtils.js";
import crypto from "crypto";

async function registerUser(req, res) {
  try {
    const { fullName, email, password, contact } = req.body;
    const normalizedEmail = String(email || '').toLowerCase().trim();

    if (!fullName || !normalizedEmail || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const isUserAlreadyExist = await userModel.findOne({ email: normalizedEmail });
    if (isUserAlreadyExist) {
      return res.status(400).json({ message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name: fullName,
      email: normalizedEmail,
      password: hashedPassword,
      contact,
    });

    const dashboardData = await getUserDashboardData(user._id);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // exclude password from returned user
    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;

    res.cookie("token", token, { httpOnly: true });
    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: userObj,
      dashboardData,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').toLowerCase().trim();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email: normalizedEmail }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // need to fetch user with password for comparison
    const userWithPassword = await userModel.findOne({ email: normalizedEmail });
    const isPasswordMatch = await bcrypt.compare(password, userWithPassword.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const dashboardData = await getUserDashboardData(user._id);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, { httpOnly: true });
    return res.status(200).json({
      message: "User Logged in successfully",
      token,
      user,
      dashboardData,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function logoutUser(req, res) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const token = req.cookies.token || tokenFromHeader;

    if (!token) {
      return res.status(400).json({ message: "User is not logged in" });
    }

    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await userModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(200).json({ message: "If that email is registered, you will receive a reset code shortly" });
    }

    const resetCode = String(Math.floor(1000 + Math.random() * 9000));
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    user.resetPasswordToken = crypto.randomUUID();

    await user.save();

    return res.status(200).json({ message: "Reset code generated successfully", success: true });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    return res.status(500).json({ message: err.message, success: false });
  }
}

async function verifyOtp(req, res) {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const user = await userModel.findOne({ email: email.toLowerCase().trim(), resetPasswordCode: String(code) });
    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const resetToken = crypto.randomUUID();
    user.resetPasswordToken = resetToken;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    return res.status(200).json({ message: "OTP verified", success: true, resetToken });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({ message: err.message, success: false });
  }
}

async function resetPassword(req, res) {
  try {
    const { email, token, password } = req.body;
    if (!email || !token || !password) {
      return res.status(400).json({ message: "Email, token and password are required" });
    }

    const user = await userModel.findOne({ email: email.toLowerCase().trim(), resetPasswordToken: token });
    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully", success: true });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return res.status(500).json({ message: err.message, success: false });
  }
}

async function getCurrentUser(req, res) {
  try {
    const userObj = req.user.toObject ? req.user.toObject() : req.user;
    delete userObj.password;

    const dashboardData = await getUserDashboardData(req.user._id);

    return res.status(200).json({
      message: "Current user fetched successfully",
      user: userObj,
      dashboardData,
    });
  } catch (err) {
    console.error("GET CURRENT USER ERROR:", err);
    return res.status(500).json({ message: err.message, success: false });
  }
}

export { registerUser, loginUser, logoutUser, forgotPassword, verifyOtp, resetPassword, getCurrentUser };