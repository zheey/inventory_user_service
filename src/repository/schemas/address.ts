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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    superUserId: {
      type: Schema.Types.ObjectId,
      ref: "SuperUser",
      required: false,
    },
  },
  { timestamps: true }
);

export const AddressObj = joiObj({
  address: Joi.string().required().trim(),
  postalCode: Joi.string().alphanum().required().trim(),
  city: Joi.string().required().trim(),
  country: Joi.string().required().trim(),
  userId: Joi.string().trim(),
  superUserId: Joi.string().trim(),
});
