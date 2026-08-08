import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    ingredients: [
      {
        type: String,
        trim: true,
      },
    ],

    recipeSteps: [
      {
        type: String,
        trim: true,
      },
    ],

    cuisine: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    prepTime: {
      type: String,
    },

    cookingTime: {
      type: String,
    },

    calories: {
      type: Number,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    video: {
      url: {
        type: String,
        required: true,
      },
      fileId: {
        type: String,
        required: true,
      },
    },

    // optional cover/thumbnail image for the reel
    cover: {
      url: { type: String },
      fileId: { type: String },
    },

    foodPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("food", foodSchema);