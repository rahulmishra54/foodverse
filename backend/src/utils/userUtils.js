import foodModel from "../models/food.model.js";
import bookmarkModel from "../models/bookmark.model.js";
import likeModel from "../models/like.model.js";
import userModel from "../models/user.models.js";

export async function getUserDashboardData(userId) {
  // Fetch reels, saved and liked lists for the user
  const [reels, savedVideos, likedVideos, user] = await Promise.all([
    // foodModel uses `foodPartner` to reference the user who uploaded the reel
    foodModel.find({ foodPartner: userId }).populate('foodPartner', 'name username profilePicture bio'),

    bookmarkModel
      .find({ user: userId })
      .populate({ path: 'food', populate: { path: 'foodPartner', select: 'name username profilePicture bio' } }),

    likeModel
      .find({ user: userId })
      .populate({ path: 'food', populate: { path: 'foodPartner', select: 'name username profilePicture bio' } }),

    // fetch user to read followers/following arrays
    userModel.findById(userId).select("followers following"),
  ]);

  const followersCount = Array.isArray(user?.followers) ? user.followers.length : 0;
  const followingCount = Array.isArray(user?.following) ? user.following.length : 0;

  return {
    reels,
    savedVideos,
    likedVideos,
    reelsCount: reels.length,
    followersCount,
    followingCount,
  };
}