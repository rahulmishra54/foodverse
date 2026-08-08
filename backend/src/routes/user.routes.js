import express from "express";
import {
    toggleFollow,
    updateProfile,
    upload,
    getUserProfile,
    listUsers,
    getFollowers,
    getFollowing
} from "../controllers/user.controller.js";

import { authUserMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ==========================
   Profile
========================== */

// Update profile
router.patch(
    "/profile",
    authUserMiddleware,
    upload.single("profilePicture"),
    updateProfile
);

/* ==========================
   Follow System
========================== */

// Toggle Follow / Unfollow
router.post(
    "/follow/:userId",
    authUserMiddleware,
    toggleFollow
);

// Get Followers
router.get(
    "/:userId/followers",
    authUserMiddleware,
    getFollowers
);

// Get Following
router.get(
    "/:userId/following",
    authUserMiddleware,
    getFollowing
);

/* ==========================
   Profile
========================== */

/* ==========================
   Users
========================== */

// Get users by ids
router.get(
    "/list/ids",
    authUserMiddleware,
    listUsers
);

// Get profile by user id
router.get(
    "/:id",
    authUserMiddleware,
    getUserProfile
);

export default router;