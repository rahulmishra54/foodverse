import express from "express";
import {getFoodItems, getReelByInfo, getReelById} from "../controllers/feed.controller.js";
import { optionalAuthUserMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", optionalAuthUserMiddleware, getFoodItems);
router.get("/info", optionalAuthUserMiddleware, getReelByInfo);
router.get("/id/:id", optionalAuthUserMiddleware, getReelById);

export default router;
