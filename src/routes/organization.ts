import express from "express";
import { createOrganization } from "../controllers";
import { validateOrganizatioPayload } from "../middlewares";
const router = express.Router();

router.post("/new", validateOrganizatioPayload, createOrganization);

export default router;
