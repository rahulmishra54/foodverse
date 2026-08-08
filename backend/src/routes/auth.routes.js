import express from "express";
import { authUserMiddleware } from "../middleware/auth.middleware.js";
import { loginUser, registerUser, logoutUser, forgotPassword, verifyOtp, resetPassword, getCurrentUser } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get("/user/logout", logoutUser);
router.get("/user/me", authUserMiddleware, getCurrentUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
