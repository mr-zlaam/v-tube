import type { Request } from "express";
import { UserModelTypes } from "../models/userModels/types.userModel";

export interface AuthRequest extends Request {
  _id?: string;
  user?: UserModelTypes;
}
export interface decodedTokenTypes {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  iat: number;
  exp: number;
}
