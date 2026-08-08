import express from "express";
import {toggleLike,getLikedReels} from "../controllers/like.controller.js";
import { authUserMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authUserMiddleware, toggleLike);
router.get(
    "/liked-reels",
    authUserMiddleware,
    getLikedReels
)
export default router;
