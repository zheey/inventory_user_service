import * as express from "express";
import { IUserPayload, IUserRole } from "../../DAO_/types";
declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
    }
  }
}
