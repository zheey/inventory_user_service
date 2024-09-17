import Joi from "joi";
import { Schema } from "mongoose";

export interface IAddress {
  address: { type: string; required: true };
  postalCode: { type: string; required: true };
  city: { type: string; required: true };
  country: { type: string; required: true };
}

export const AddressSchema = new Schema<IAddress>(
  {
    address: Joi.string().trim(),
    postalCode: Joi.string().alphanum().trim(),
    city: Joi.string().trim(),
    country: Joi.string().trim(),
  },
  { timestamps: true }
);
