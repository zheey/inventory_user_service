import Joi from "joi";
import { Schema } from "mongoose";
import { IAddress } from "./types";
import { joiObj } from "./helper";

export const AddressSchema = new Schema<IAddress>(
  {
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  { timestamps: true }
);

export const Addressbj = joiObj({
  address: Joi.string().required().trim(),
  postalCode: Joi.string().alphanum().required().trim(),
  city: Joi.string().required().trim(),
  country: Joi.string().required().trim(),
  organizationId: Joi.string().required().trim(),
});
