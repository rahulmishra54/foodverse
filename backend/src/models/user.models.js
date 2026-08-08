import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
{
    name: String,
    username: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        trim: true,
    },

    bio: {
        type: String,
        default: ""
    },

    profilePicture: {
        type: String,
        default: ""
    },

    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    status: {
        type: String,
        enum: ["active", "banned"],
        default: "active"
    },
    resetPasswordToken: String,
    resetPasswordCode: String,
    resetPasswordExpires: Date,
},
{
    timestamps: true
});


userSchema.index({ username: 1 }, { unique: true, sparse: true });

const userModel = mongoose.model("User",userSchema);

export default userModel;
