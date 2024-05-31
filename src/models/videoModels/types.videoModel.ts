import { Document, Schema } from "mongoose";

export interface VideoModelTypes extends Document {
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  owner: Schema.Types.ObjectId;
}
