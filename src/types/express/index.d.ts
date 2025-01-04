import * as express from "express";
import { IUserRole } from "../../DAO_/types";
declare global {
  namespace Express {
    interface Request {
      user?: Record<string, IUserRole>;
    }
  }
}
