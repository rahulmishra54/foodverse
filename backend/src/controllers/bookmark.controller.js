import bookmarkModel from "../models/bookmark.model.js";

export const Bookmark = async (req, res) => {
    const { foodId } = req.body;

    try {

        const existingBookmark = await bookmarkModel.findOne({
            food: foodId,
            user: req.user._id
        });

        if (existingBookmark) {

            await bookmarkModel.findByIdAndDelete(existingBookmark._id);

            return res.status(200).json({
                success: true,
                message: "Bookmark removed successfully"
            });

        }

        await bookmarkModel.create({
            food: foodId,
            user: req.user._id
        });

        return res.status(201).json({
            success: true,
            message: "Bookmark added successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getSavedReels = async (req, res) => {
    try {

        const savedReels = await bookmarkModel.find({
            user: req.user._id
        })
        .populate({
            path: "food",
            populate: {
                path: "foodPartner",
                select: "name username profilePicture"
            }
        })
        .sort({ createdAt: -1 });

        const reels = savedReels
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