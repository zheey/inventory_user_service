import Joi from "joi";
import { Schema } from "mongoose";
import { IOutlet } from "./types";
import { joiObj } from "./helper";

export const OutletSchema = new Schema<IOutlet>(
  {
    name: { type: String, required: true },
    address: { type: Schema.Types.ObjectId, ref: "Address" },
    phoneNumber: { type: Number },
    email: { type: String },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
  },
  { timestamps: true }
);

export const outletObj = joiObj({
  name: Joi.string().required(),
  address: Joi.string().required(),
  phoneNumber: Joi.number(),
  email: Joi.string(),
  organizationId: Joi.string().required(),
});
