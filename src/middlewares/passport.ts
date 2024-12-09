import { JwtPayload } from "jsonwebtoken";
import { SuperUser, User } from "../repository/models";
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const opts: JwtPayload = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.AUTH_SECRET;

passport.use(
  new JwtStrategy(opts, async function (
    jwt_payload: JwtPayload,
    cb: (err: unknown | null, data?: any) => any
  ) {
    try {
      let user: any;

      if (jwt_payload.userRole?.toLowerCase() === "superadmin") {
        user = await SuperUser.findOne({ _id: jwt_payload.userId });
      } else {
        user = await User.findOne({ _id: jwt_payload.userId });
      }
      if (!user) {
        return cb(null, false);
      }
      let payload = {};

      if (user.organizationId) {
        payload = {
          userId: user.id,
          userRole: user.role,
          organizationId: user.organizationId,
        };
      } else {
        payload = {
          userId: user.id,
          userRole: user.role,
          outlets: user.outlets,
        };
      }
      return cb(null, payload);
    } catch (error) {
      return cb(error);
    }
  })
);
