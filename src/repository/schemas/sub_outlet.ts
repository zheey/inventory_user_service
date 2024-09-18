import Joi from "joi";
import { Schema } from "mongoose";
import { ISubOutlet } from "./types";
import { joiObj } from "./helper";

export const SubOutletSchema = new Schema<ISubOutlet>(
  {
    name: { type: String, required: true },
    address: { type: Schema.Types.ObjectId, ref: "Address" },
    phoneNumber: { type: Number },
    email: { type: String },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
  },
  { timestamps: true }
);

export const subOutletObj = joiObj({
  name: Joi.string().required(),
  address: { type: Schema.Types.ObjectId, ref: "Address" },
  phoneNumber: Joi.number(),
  email: Joi.string(),
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
});
