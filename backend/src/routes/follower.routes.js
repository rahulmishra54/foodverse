import express from "express";

import {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
} from "../controllers/user.controller.js";

import authUserMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Follow a user
router.post(
    "/follow/:userId",
    authUserMiddleware,
    followUser
);

// Unfollow a user
router.post(
    "/unfollow/:userId",
    authUserMiddleware,
    unfollowUser
);

// Get followers of a user
router.get(
    "/:userId/followers",
    authUserMiddleware,
    getFollowers
);

// Get users followed by a user
router.get(
    "/:userId/following",
    authUserMiddleware,
    getFollowing
);

export default router;