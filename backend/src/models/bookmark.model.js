import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "food",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent a user from bookmarking the same reel multiple times
bookmarkSchema.index({ food: 1, user: 1 }, { unique: true });

export default mongoose.model("bookmark", bookmarkSchema);