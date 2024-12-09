import { Express } from "express";

import authRoutes from "./auth";
import userRoutes from "./users";
import organizationRoutes from "./organization";
import outletRoutes from "./outlet";

import "../middlewares/passport";

export default function (app: Express) {
  app.use("/auth", authRoutes);
  app.use("/user", userRoutes);
  app.use("/outlet", outletRoutes);
  app.use("/organization", organizationRoutes);
}
