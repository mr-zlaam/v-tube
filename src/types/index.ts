import type { Request } from "express";
import { UserModelTypes } from "../models/userModels/types.userModel";

export interface AuthRequest extends Request {
  _id?: string;
  user?: UserModelTypes;
}
