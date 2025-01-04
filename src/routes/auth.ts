import express from "express";
import { createUser, userLogin } from "../controllers";
import { validateBodyPayload } from "../middlewares";
import { userObj } from "../repository/schemas/user";
import {
  superUserLoginObj,
  superUserTokenObj,
  superUserUpdateObj,
  userLoginParamObj,
} from "../controllers/paramsValidationObj";
import {
  generateVerificationToken,
  setSuperUserPassword,
  userSuperLogin,
} from "../controllers/auth_super_user";
import { hasResource, passportAuth } from "../middlewares/auth";
const router = express.Router();
const verifyUserToken = passportAuth();

router.post(
  "/new-user",
  [verifyUserToken, hasResource("admin"), validateBodyPayload(userObj)],
  createUser
);
router.post("/login", [validateBodyPayload(userLoginParamObj)], userLogin);
router.post(
  "/super/verification",
  [
    verifyUserToken,
    hasResource("super"),
    validateBodyPayload(superUserUpdateObj),
  ],
  setSuperUserPassword
);
router.post(
  "/super/login",
  [validateBodyPayload(superUserLoginObj)],
  userSuperLogin
);
router.post(
  "/super/generateToken",
  [validateBodyPayload(superUserTokenObj)],
  generateVerificationToken
);

export default router;
