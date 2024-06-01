import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asynchandler";

const RegisterUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.json({
      message: "OK",
    });
  }
);
export { RegisterUser };
