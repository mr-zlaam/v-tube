import mongoose, { Schema } from "mongoose";
import type { UserModelTypes } from "./types.userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_EXPIRE,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_EXPIRE,
} from "../../config";
import { OPT_JWT_REFRESH_TOKEN } from "../../CONSTANTS";
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
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = function () {
  const payload = {
    _id: this._id,
    email: this.email,
    username: this.username,
    fullName: this.fullName,
  };
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRE });
};
userSchema.methods.generateAccessToken = function () {
  const payload = { _id: this._id };
  return jwt.sign(payload, OPT_JWT_REFRESH_TOKEN, {
    expiresIn: JWT_REFRESH_EXPIRE,
  });
};
userSchema.methods.generateRefreshToken = function () {};
export const User = mongoose.model<UserModelTypes>("UserModel", userSchema);
