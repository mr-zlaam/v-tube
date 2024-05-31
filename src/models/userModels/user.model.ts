import mongoose, { Schema } from "mongoose";
import type { UserModelTypes } from "./types.userModel";
const userSchema = new Schema<UserModelTypes>(
  {
    username: {
      type: String,
      required: [true, "username is required!!"],
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "email is required!!"],
      lowercase: true,
      trim: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, "fullName is required!!"],
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary string
      required: true,
    },
    coverImage: {
      type: String, //cloudinary string
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
export const User = mongoose.model<UserModelTypes>("UserModel", userSchema);
