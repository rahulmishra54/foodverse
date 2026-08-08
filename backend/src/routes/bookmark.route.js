import {Bookmark,getSavedReels} from "../controllers/bookmark.controller.js"

import express from "express";

import { authUserMiddleware } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/", authUserMiddleware, Bookmark);
router.get(
    "/saved-reels",
    authUserMiddleware,
    getSavedReels
)

export default router;

