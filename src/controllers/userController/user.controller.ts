import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asynchandler";

export const RegisterUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.status(200).json({
      message: "OK",
    });
  }
);
