import commentModel from "../models/comment.model.js";


export const getCommentCount = async (foodId) => {
    return await commentModel.countDocuments({
        food: foodId,
    });
};