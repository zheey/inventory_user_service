import express from "express";
import { createOutlet } from "../controllers";
import { validateBodyPayload } from "../middlewares";
import { outletObj } from "../repository/schemas/outlet";
const router = express.Router();

router.post("/new", [validateBodyPayload(outletObj)], createOutlet);

export default router;
