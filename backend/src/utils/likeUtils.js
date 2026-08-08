import Like from "../models/like.model.js";
import bookmarkModel from "../models/bookmark.model.js";

export const getLikesCount = async (foodId) => {
    return await Like.countDocuments({
        food: foodId,
    });
};

export const getBookmarkCount = async (foodId) => {
    return await bookmarkModel.countDocuments({
        food: foodId,
    });
};


