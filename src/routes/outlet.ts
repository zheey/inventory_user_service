import express from "express";
import { createOutlet } from "../controllers";
import { validateBodyPayload } from "../middlewares";
import { outletObj } from "../repository/schemas/outlet";
import { hasResource, passportAuth } from "../middlewares/auth";
const router = express.Router();
const verifyUserToken = passportAuth();

router.post(
  "/new",
  [verifyUserToken, hasResource("admin"), validateBodyPayload(outletObj)],
  createOutlet
);

export default router;
