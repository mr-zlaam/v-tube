import mongoose, { Schema } from "mongoose";
import { UserModelTypes } from "./types.userModel";
const userSchema = new Schema<UserModelTypes>(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
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
      },
    ],
  },
  { timestamps: true }
);
export const User = mongoose.model<UserModelTypes>("UserModel", userSchema);
