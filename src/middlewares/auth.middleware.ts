import type { NextFunction, Response } from "express";
import { asyncHandler } from "../utils/asynchandler";

import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../config";
import { User } from "../models/userModels/user.model";
import { AuthRequest, decodedTokenTypes } from "../types";

export const verifyJwt = asyncHandler(
  async (req: AuthRequest, _: Response, next: NextFunction) => {
    try {
      const newToken: string =
        req.cookies?.accessToken || (req.header("Authorization") as string); // check if there is a token in the cookie or in the header
      let token;
      if (newToken.includes("Bearer ")) {
        token = newToken.replace("Bearer ", "");
      }
      console.log("TOKEN:", token);
      console.log("JWT SECRET:", JWT_ACCESS_SECRET);
      if (!token) throw { status: 401, message: "unauthorized request!!" };
      const decodedToken: decodedTokenTypes = jwt.verify(
        token,
        JWT_ACCESS_SECRET
      ) as decodedTokenTypes;
      console.log(decodedToken);
      req._id = decodedToken._id;
      const userId = req._id;
      console.log(userId);
      const user = await User.findById(userId).select(
        "-password -refreshToken"
      );

      if (!user)
        throw {
          status: 401,
          message: "unauthorized request due to invalid access Token!!",
        };
      req.user = user;
      next();
    } catch (error: any) {
      console.log(error.message);
      throw { status: 401, message: error.message || "invalid accessToken" };
    }
  }
);
