import Like from "../models/like.model.js";
import Food from "../models/food.model.js";
const toggleLike = async (req, res) => {
  try {
    const { foodId } = req.body;
    const userId = req.user?._id || req.user?.id;

    const existingLike = await Like.findOne({
      food: foodId,
      user: userId,
    });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);

      const count = await Like.countDocuments({ food: foodId });
      return res.status(200).json({
        success: true,
        action: 'removed',
        message: 'Like removed',
        likes: count,
      });
    }

    try {
      await Like.create({
        food: foodId,
        user: userId,
      });
    } catch (dupErr) {
      // duplicate key or race condition - treat as already liked
      console.warn('Like create warning:', dupErr.message);
    }

    const count = await Like.countDocuments({ food: foodId });
    return res.status(201).json({
      success: true,
      action: 'created',
      message: 'Liked successfully',
      likes: count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const getLikedReels = async (req, res) => {
    try {
        const likedReels = await Like.find({
            user: req.user._id
        }).populate({
            path: "food",
            populate: {
                path: "foodPartner",
                select: "name username profilePicture"
            }
        });

        const reels = likedReels
            .filter(item => item.food)
            .map(item => item.food);

        return res.status(200).json({
            success: true,
            reels
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export { toggleLike, getLikedReels };
