import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { SuperUser, User } from "../repository/models";
import { sendErrorResponse } from "../utils/response_handlers";
import {
  AUTHENTICATION_ERROR,
  AUTHENTICATION_FAILED,
  INTERNAL_ERROR,
  NO_PAYLOAD_PERMISSION_DENIED,
  NOT_AUTHORIZED_PERMISSION_DENIED,
} from "../utils/response";
import { AuthActions, authorizedActions } from "../types/authorization";
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const opts: JwtPayload = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.AUTH_SECRET;

interface VerifiedRequest extends Request {
  payload: JwtPayload;
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    return passport.use(
      new JwtStrategy(opts, async function (jwt_payload: JwtPayload) {
        const user = await SuperUser.findOne({ id: jwt_payload.userId });

        if (!user) {
          return sendErrorResponse(res, {}, AUTHENTICATION_ERROR, 400);
        }
        if (user) {
          req.user = jwt_payload;
          return next();
        } else {
          return sendErrorResponse(res, {}, AUTHENTICATION_FAILED, 401);
        }
      })
    );
  } catch (err) {
    return sendErrorResponse(res, {}, INTERNAL_ERROR, 500);
  }
};

export const hasResource = (authorizedAction: AuthActions) => {
  return (req: VerifiedRequest, res: Response, next: NextFunction) => {
    if (req.payload == undefined) {
      return sendErrorResponse(res, {}, NO_PAYLOAD_PERMISSION_DENIED, 403);
    }

    const requiredRoles = authorizedActions[authorizedAction];
    let userRole = req.payload?.userRole?.toLowerCase();

    if (!requiredRoles)
      return sendErrorResponse(res, [], NOT_AUTHORIZED_PERMISSION_DENIED, 403);

    if (requiredRoles.length === 0) {
      return next();
    }

    if (userRole) {
      if (requiredRoles.includes(userRole)) {
        return next();
      }
    }
    return sendErrorResponse(res, [], NOT_AUTHORIZED_PERMISSION_DENIED, 403);
  };
};

export const passportAuth = () =>
  passport.authenticate("jwt", { session: false });
