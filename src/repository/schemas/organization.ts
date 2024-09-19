import Joi from "joi";
import { Schema } from "mongoose";
import { IOrganization } from "./types";
import { joiObj } from "./helper";

export const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true },
    logo: { type: String },
    createdBy: { type: String, required: true },
    outlets: [{ type: Schema.Types.ObjectId, ref: "Outlet" }],
  },
  { timestamps: true }
);

export const organizationObj = joiObj({
  name: Joi.string().required(),
  logo: Joi.string(),
  createdBy: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
  outlets: Joi.array(),
});
