import type { Request } from "express";

export interface AuthRequest extends Request {
  _id?: string;
  user?: any;
}
