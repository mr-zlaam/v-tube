import { Document, Schema } from "mongoose";

export interface UserModelTypes extends Document {
  watchHistory: Schema.Types.ObjectId;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage: string;
  password: any;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
  //methods
  isPasswordCorrect: (password: string) => Promise<boolean>;
  generateAccessToken: () => void;
  generateRefreshToken: () => void;
}
