import express from "express";
import createComment, { getComments } from "../controllers/comment.controller.js";
import { authUserMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authUserMiddleware, createComment);
router.get("/:foodId", authUserMiddleware, getComments);

export default router;
