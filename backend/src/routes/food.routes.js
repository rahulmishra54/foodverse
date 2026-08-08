import express from "express";
import multer from "multer";
import { createFood, deleteFoodItem, getOwnFoodItems } from "../controllers/food.controller.js";
import {  authUserMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
});

// accept multipart/form-data with fields: video (file, required) and coverImage (file, optional)
router.post("/", authUserMiddleware, upload.fields([{ name: 'video', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), createFood);
router.delete("/:id", authUserMiddleware, deleteFoodItem);
router.get("/own", authUserMiddleware, getOwnFoodItems);

export default router;
