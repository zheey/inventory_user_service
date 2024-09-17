import Joi from "joi";
import { Schema, Types } from "mongoose";

export interface ISubOutlet {
  name: { type: string; required: true };
  address: { type: Types.ObjectId };
  phoneNumber?: { type: Number };
  email?: { type: string };
}

export const SubOutletSchema = new Schema<ISubOutlet>(
  {
    name: Joi.string().required(),
    address: { type: Schema.Types.ObjectId, ref: "Address" },
    phoneNumber: Joi.number(),
    email: Joi.string(),
  },
  { timestamps: true }
);
