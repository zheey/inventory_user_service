import Joi from "joi";
import { Schema } from "mongoose";
import { IAddress } from "./types";

export const AddressSchema = new Schema<IAddress>(
  {
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  { timestamps: true }
);

export const Addressbj = Joi.object({
  address: Joi.string().required().trim(),
  postalCode: Joi.string().alphanum().required().trim(),
  city: Joi.string().required().trim(),
  country: Joi.string().required().trim(),
});