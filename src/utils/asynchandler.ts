import type { NextFunction, Request, Response } from "express";

const asyncHandler = (requestHandler: any) => {
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
export { asyncHandler };
