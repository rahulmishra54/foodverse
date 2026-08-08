import foodModel from "../models/food.model.js";
import userModel from "../models/user.models.js";
import { getLikesCount, getBookmarkCount } from "../utils/likeUtils.js";
import { getCommentCount } from "../utils/commentUtils.js";
import Like from "../models/like.model.js";
import bookmarkModel from "../models/bookmark.model.js";

function normalizeFoodPartner(fp) {
  if (!fp) return fp;
  // ensure frontend-friendly fields exist (ownerName / restaurantName fallback to name)
  const obj = fp.toObject ? fp.toObject() : fp;
  return {
    ...obj,
    ownerName: obj.ownerName || obj.restaurantName || obj.name || "",
    restaurantName: obj.restaurantName || obj.ownerName || obj.name || "",
    contactNumber: obj.contactNumber || obj.contact || "",
    address: obj.address || "",
  };
}

async function getFoodItems(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const foodItems = await foodModel
      .find({})
      .populate("foodPartner", "name profilePicture email contact")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const result = await Promise.all(
      foodItems.map(async (item) => {
        const [likes, comments, bookmarks] = await Promise.all([
          getLikesCount(item._id),
          getCommentCount(item._id),
          getBookmarkCount(item._id),
        ]);

        const obj = item.toObject();
        obj.foodPartner = normalizeFoodPartner(obj.foodPartner);

        // normalize commonly expected frontend fields
        obj.id = obj._id;
        obj.foodPartnerId = obj.foodPartner?._id || obj.foodPartner?._id;
        obj.thumbnail = obj.cover?.url || obj.video?.thumbnail || null;

        // determine if current user is following the partner
        let isFollowing = false;
        if (req.user && obj.foodPartner && obj.foodPartner._id) {
          isFollowing = await userModel.exists({ _id: obj.foodPartner._id, followers: req.user._id });
        }

        // check if current user liked or saved this item
        let isLiked = false;
        let isSaved = false;
        if (req.user) {
          isLiked = await Like.exists({ food: item._id, user: req.user._id });
          isSaved = await bookmarkModel.exists({ food: item._id, user: req.user._id });
        }

        return {
          ...obj,
          likes,
          comments,
          bookmarks,
          isFollowing: Boolean(isFollowing),
          isLiked: Boolean(isLiked),
          isSaved: Boolean(isSaved),
        };
      })
    );

    return res.status(200).json({
      message: "Food items fetched successfully",
      foodItems: result,
    });
  } catch (err) {
    console.error("FETCH ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
}

async function getReelByInfo(req, res) {
  try {
    const info = String(req.query.info || '').trim();
    if (!info) {
      return res.status(200).json({ message: "No search query provided", success: true, foodItems: [] });
    }

    const foodItems = await foodModel
      .find({ $or: [{ name: { $regex: info, $options: "i" } }, { description: { $regex: info, $options: "i" } }] })
      .populate("foodPartner", "name profilePicture email contact")
      .sort({ createdAt: -1 });

    if (!foodItems || foodItems.length === 0) {
      return res.status(200).json({ message: "No food items found matching the provided info", success: true, foodItems: [] });
    }

    const normalizedPromises = foodItems.map(async (fi) => {
      const obj = fi.toObject();
      obj.foodPartner = normalizeFoodPartner(obj.foodPartner);
      obj.id = obj._id;
      obj.foodPartnerId = obj.foodPartner?._id;
      obj.thumbnail = obj.cover?.url || obj.video?.thumbnail || null;
      let isFollowing = false;
      let isLiked = false;
      let isSaved = false;
      const bookmarks = await getBookmarkCount(fi._id);
      if (req.user && obj.foodPartner && obj.foodPartner._id) {
        isFollowing = await userModel.exists({ _id: obj.foodPartner._id, followers: req.user._id });
      }
      if (req.user) {
        isLiked = await Like.exists({ food: fi._id, user: req.user._id });
        isSaved = await bookmarkModel.exists({ food: fi._id, user: req.user._id });
      }
      return {
        ...obj,
        bookmarks,
        isFollowing: Boolean(isFollowing),
        isLiked: Boolean(isLiked),
        isSaved: Boolean(isSaved),
      };
    });

    const normalized = await Promise.all(normalizedPromises);

    return res.status(200).json({
      message: "Food items fetched successfully",
      success: true,
      foodItems: normalized,
    });
  } catch (err) {
    console.error("FETCH ERROR:", err);
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
}

async function getReelById(req, res) {
  try {
    const foodItem = await foodModel.findById(req.params.id).populate("foodPartner", "name profilePicture email contact");

    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const [likes, comments, bookmarks] = await Promise.all([
      getLikesCount(foodItem._id),
      getCommentCount(foodItem._id),
      getBookmarkCount(foodItem._id),
    ]);

    const obj = foodItem.toObject();
    obj.foodPartner = normalizeFoodPartner(obj.foodPartner);
    obj.id = obj._id;
    obj.foodPartnerId = obj.foodPartner?._id;
    obj.thumbnail = obj.cover?.url || obj.video?.thumbnail || null;

    // isFollowing for the single reel
    let isFollowing = false;
    if (req.user && obj.foodPartner && obj.foodPartner._id) {
      isFollowing = await userModel.exists({ _id: obj.foodPartner._id, followers: req.user._id });
    }

    // isLiked / isSaved
    let isLiked = false;
    let isSaved = false;
    if (req.user) {
      isLiked = await Like.exists({ food: foodItem._id, user: req.user._id });
      isSaved = await bookmarkModel.exists({ food: foodItem._id, user: req.user._id });
    }

    return res.status(200).json({
      message: "Food item fetched successfully",
      success: true,
      foodItem: obj,
      likes,
      comments,
      bookmarks,
      isFollowing: Boolean(isFollowing),
      isLiked: Boolean(isLiked),
      isSaved: Boolean(isSaved),
    });
  } catch (err) {
    console.error("FETCH ERROR:", err);
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
}

export { getFoodItems, getReelByInfo, getReelById };
