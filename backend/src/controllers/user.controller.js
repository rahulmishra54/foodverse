import userModel from "../models/user.models.js";
import { uploadImage } from "../services/storage.services.js";
import { getUserDashboardData } from "../utils/userUtils.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

async function toggleFollow(req, res) {
  try {
    // support both route param and body param for target user id
    const targetUserId = req.params.userId || req.body.targetUserId;
    const currentUserId = req.user._id;

    if (!targetUserId) return res.status(400).json({ success: false, message: "target user id required" });
    if (String(targetUserId) === String(currentUserId)) return res.status(400).json({ success: false, message: "Cannot follow yourself" });

    const targetUser = await userModel.findById(targetUserId);
    const currentUser = await userModel.findById(currentUserId);

    if (!targetUser || !currentUser) return res.status(404).json({ success: false, message: "User not found" });

    const alreadyFollowing = targetUser.followers?.some((id) => String(id) === String(currentUserId));

    if (alreadyFollowing) {
      // remove follower
      targetUser.followers = targetUser.followers.filter((id) => String(id) !== String(currentUserId));
      currentUser.following = currentUser.following.filter((id) => String(id) !== String(targetUserId));
      await targetUser.save();
      await currentUser.save();

      // return updated current user for frontend state
      const userObj = currentUser.toObject();
      delete userObj.password;
      return res.status(200).json({ success: true, action: 'unfollowed', user: userObj });
    } else {
      // add follower
      targetUser.followers = targetUser.followers || [];
      currentUser.following = currentUser.following || [];
      targetUser.followers.push(currentUserId);
      currentUser.following.push(targetUserId);
      await targetUser.save();
      await currentUser.save();

      const userObj = currentUser.toObject();
      delete userObj.password;
      return res.status(201).json({ success: true, action: 'followed', user: userObj });
    }
  } catch (err) {
    console.error('FOLLOW ERROR:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

// Handler for updating profile (including profilePicture)
async function updateProfile(req, res) {
  try {
    // multer will attach file to req.file
    const userId = req.user._id;
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // handle profile picture upload
    if (req.file) {
      const uploadResult = await uploadImage(req.file.buffer, `profile-${userId}`);
      user.profilePicture = uploadResult.url;
    }

    // accept optional fields: name, username, bio/description
    const { name, username, bio } = req.body;

    if (name) user.name = name;

    if (typeof username === 'string' && username.trim().length > 0) {
      const existing = await userModel.findOne({ username: username.trim() });
      if (existing && String(existing._id) !== String(userId)) {
        return res.status(400).json({ success: false, message: 'Username already taken' });
      }
      user.username = username.trim();
    }

    if (typeof bio === 'string') {
      user.bio = bio;
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({ success: true, user: userObj });
  } catch (err) {
    console.error('UPDATE PROFILE ERROR:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
}



export async function getUserProfile(req, res) {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const dashboardData = await getUserDashboardData(userId);
    return res.status(200).json({ user, dashboardData });
  } catch (err) {
    console.error('GET USER PROFILE ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
}

// List users by comma-separated ids (ids param) or array via query
export async function listUsers(req, res) {
  try {
    const idsQuery = req.query.ids || '';
    const ids = Array.isArray(req.query.ids) ? req.query.ids : (idsQuery ? String(idsQuery).split(',') : []);
    if (!ids || ids.length === 0) return res.status(200).json({ users: [] });

    const users = await userModel.find({ _id: { $in: ids } }).select('name username profilePicture');
    return res.status(200).json({ users });
  } catch (err) {
    console.error('LIST USERS ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
}







export const getFollowers = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId)
      .populate('followers', 'name username profilePicture bio');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.status(200).json({ success: true, followers: user.followers });
  } catch (error) {
    console.error('GET FOLLOWERS ERROR:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId)
      .populate('following', 'name username profilePicture bio');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.status(200).json({ success: true, following: user.following });
  } catch (error) {
    console.error('GET FOLLOWING ERROR:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { toggleFollow, updateProfile, upload };
