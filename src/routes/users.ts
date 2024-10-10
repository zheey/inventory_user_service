import express from "express";
import { createOrganization } from "../controllers";
const router = express.Router();

router.post("/", createOrganization);

export default router;
