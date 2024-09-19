import express from "express";
import { createUser, userLogin } from "../controllers";
import { validateBodyPayload } from "../middlewares";
import { userObj } from "../repository/schemas/user";
import { userLoginParamObj } from "../controllers/paramsValidationObj";
const router = express.Router();

router.post("/new-user", [validateBodyPayload(userObj)], createUser);
router.post("/login", [validateBodyPayload(userLoginParamObj)], userLogin);

export default router;
