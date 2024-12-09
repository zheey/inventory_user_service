export type JWTVerifyOption = {
  jwtFromRequest?: any;
  secretOrKey?: string;
  issuer?: string;
  audience?: string;
};
