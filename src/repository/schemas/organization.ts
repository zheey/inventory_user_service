import Joi from "joi";
import { Schema, Types } from "mongoose";
import { ISubOutlet } from "./sub_outlet";

interface IOrganization {
  name: { type: String };
  logo?: { type: String };
  subOutlet: { type: Types.ObjectId[] };
}

export const OrganizationSchema = new Schema<IOrganization>(
  {
    name: Joi.string().required(),
    logo: Joi.string(),
    subOutlet: [{ type: Schema.Types.ObjectId, ref: "SubOutlet" }],
  },
  { timestamps: true }
);
