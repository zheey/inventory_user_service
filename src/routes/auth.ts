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
import { passportAuth } from "../middlewares/auth";
const router = express.Router();
const verifyUserToken = passportAuth();

router.post("/new-user", [validateBodyPayload(userObj)], createUser);
router.post(
  "/login",
  [verifyUserToken, validateBodyPayload(userLoginParamObj)],
  userLogin
);
router.post(
  "/super/verification",
  [verifyUserToken, validateBodyPayload(superUserUpdateObj)],
  setSuperUserPassword
);
router.post(
  "/super/login",
  [verifyUserToken, validateBodyPayload(superUserLoginObj)],
  userSuperLogin
);
router.post(
  "/super/generateToken",
  [validateBodyPayload(superUserTokenObj)],
  generateVerificationToken
);

export default router;
