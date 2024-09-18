import Joi from "joi";
import { Schema } from "mongoose";
import { IOrganization } from "./types";

export const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true },
    logo: { type: String },
    subOutlets: [{ type: Schema.Types.ObjectId, ref: "SubOutlet" }],
  },
  { timestamps: true }
);

export const OrganizationObj = Joi.object({
  name: Joi.string().required(),
  logo: Joi.string(),
  subOutlets: [{ type: Schema.Types.ObjectId, ref: "SubOutlet" }],
});
