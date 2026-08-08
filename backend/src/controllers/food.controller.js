import foodModel from "../models/food.model.js";
import Like from "../models/like.model.js";
import bookmarkModel from "../models/bookmark.model.js";
import commentModel from "../models/comment.model.js";
import { v4 as uuidv4 } from "uuid";
import { uploadImage } from "../services/storage.services.js";

function normalizeFoodPartner(fp) {
  if (!fp) return fp;
  const obj = fp.toObject ? fp.toObject() : fp;
  return {
    ...obj,
    ownerName: obj.ownerName || obj.restaurantName || obj.name || "",
    restaurantName: obj.restaurantName || obj.ownerName || obj.name || "",
    contactNumber: obj.contactNumber || obj.contact || "",
    address: obj.address || "",
  };
}

async function createFood(req, res) {
  try {
    // expect multipart/form-data with files: video (required) and optional coverImage
    const videoFile = req.files?.video?.[0];
    const coverFile = req.files?.coverImage?.[0];

    if (!videoFile) {
      return res.status(400).json({ message: "Video required" });
    }

    const { name, cuisine, difficulty, privacy } = req.body;
    if (!name || !cuisine || !difficulty || !privacy) {
      return res.status(400).json({ message: "Name, cuisine, difficulty and privacy are required" });
    }

    const videoUploadResult = await uploadImage(videoFile.buffer, uuidv4());

    let coverUploadResult = null;
    if (coverFile) {
      coverUploadResult = await uploadImage(coverFile.buffer, uuidv4());
    }

    const ingredients = req.body.ingredients
      ? String(req.body.ingredients)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];
    const recipeSteps = req.body.recipeSteps || req.body.steps
      ? String(req.body.recipeSteps || req.body.steps)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];
    const tags = req.body.tags
      ? String(req.body.tags)
          .split(",")
          .map((item) => item.trim().replace(/^#/, ""))
          .filter(Boolean)
      : [];

    const foodItem = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      ingredients,
      recipeSteps,
      cuisine: req.body.cuisine,
      difficulty: req.body.difficulty,
      prepTime: req.body.prepTime,
      cookingTime: req.body.cookingTime || req.body.cookTime,
      calories: req.body.calories ? Number(req.body.calories) : undefined,
      tags,
      privacy: req.body.privacy,
      video: {
        url: videoUploadResult.url,
        fileId: videoUploadResult.fileId,
      },
      cover: coverUploadResult
        ? { url: coverUploadResult.url, fileId: coverUploadResult.fileId }
        : undefined,
      foodPartner: req.foodPartner._id,
    });

    return res.status(201).json({
      message: "Food item created successfully",
      foodItem,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
}

async function getOwnFoodItems(req, res) {
  try {
    const foodItems = await foodModel
      .find({ foodPartner: req.foodPartner._id })
      .populate("foodPartner", "name profilePicture email contact");

    const normalized = foodItems.map((fi) => {
      const obj = fi.toObject();
      obj.foodPartner = normalizeFoodPartner(obj.foodPartner);
      return obj;
    });

    return res.status(200).json({
      message: "Food items fetched successfully",
      foodItems: normalized,
    });
  } catch (err) {
    console.error("FETCH ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
}

async function deleteFoodItem(req, res) {
  try {
    const foodItem = await foodModel.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    if (String(foodItem.foodPartner) !== String(req.foodPartner._id) && req.foodPartner.role !== 'admin') {
      return res.status(403).json({ message: "You are not authorized to delete this reel" });
    }

    await Promise.all([
      Like.deleteMany({ food: foodItem._id }),
      bookmarkModel.deleteMany({ food: foodItem._id }),
      commentModel.deleteMany({ food: foodItem._id }),
      foodItem.deleteOne(),
    ]);

    return res.status(200).json({
      message: "Food item deleted successfully",
      success: true,
    });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
}

export { createFood, getOwnFoodItems, deleteFoodItem };