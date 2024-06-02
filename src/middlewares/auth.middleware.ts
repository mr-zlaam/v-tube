import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asynchandler";

import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../config";
import { User } from "../models/userModels/user.model";
export interface AuthRequest extends Request {
  _id?: string;
  user?: any;
}
export const verifyJwt = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer  ", ""); // check if there is a token in the cookie or in the header
    if (!token) throw { status: 401, message: "unauthorized request!!" };
    const decodedToken = jwt.verify(token, JWT_ACCESS_SECRET);
    req._id = decodedToken.sub as string;
    const userId = req._id;

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user)
      throw {
        status: 401,
        message: "unauthorized request due to invalid access Token!!",
      };
    req.user = user;
    next();
  }
);
