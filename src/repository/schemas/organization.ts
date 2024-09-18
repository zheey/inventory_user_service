import Joi from "joi";
import { Schema } from "mongoose";
import { IOrganization } from "./types";
import { joiObj } from "./helper";

export const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true },
    logo: { type: String },
    subOutlets: [{ type: Schema.Types.ObjectId, ref: "SubOutlet" }],
  },
  { timestamps: true }
);

export const organizationObj = joiObj({
  name: Joi.string().required(),
  logo: Joi.string(),
  subOutlets: [{ type: Schema.Types.ObjectId, ref: "SubOutlet" }],
});
