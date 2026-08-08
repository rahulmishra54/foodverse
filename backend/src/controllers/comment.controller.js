import commentModel from "../models/comment.model.js";
import userModel from "../models/user.models.js";

async function createComment(req, res) {
  try {
    const { foodId, comment } = req.body;
    const userId = req.user?._id || req.user?.id;

    const newComment = await commentModel.create({
      food: foodId,
      user: userId,
      comment,
    });

    // populate user fields for immediate response
    const populated = await commentModel.findById(newComment._id).populate("user", "name profilePicture username");

    return res.status(201).json({
      message: "Comment created successfully",
      comment: populated,
    });
  } catch (error) {
    console.error('CREATE COMMENT ERROR:', error);
    return res.status(500).json({
      message: "Error creating comment",
      error: error.message,
    });
  }
}

// GET comments for a food item
export async function getComments(req, res) {
  try {
    const foodId = req.params.foodId;
    if (!foodId) return res.status(400).json({ message: 'foodId required' });

    const comments = await commentModel.find({ food: foodId }).sort({ createdAt: 1 }).populate('user', 'name profilePicture username');

    return res.status(200).json({ message: 'Comments fetched', comments });
  } catch (err) {
    console.error('GET COMMENTS ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
}

export default createComment;

