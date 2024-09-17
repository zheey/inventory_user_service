import Joi from "joi";

import { Schema, Types } from "mongoose";
import { IAddress } from "./address";

interface IUser {
  firstName: { type: string; required: true };
  lastName: { type: string; required: true };
  phoneNumber: { type: Number; required: true };
  email: { type: string; required: true };
  password: { type: string; required: true };
  addresses?: { type: IAddress[]; required: false };
  role: { type: string; required: true };
  isArchived?: { type: Boolean; required: false };
  avatar?: { type: string };
  organization: { type: Types.ObjectId[] };
}

export const UserSchema = new Schema<IUser>(
  {
    firstName: Joi.string().alphanum().trim().min(3).max(50).required(),
    lastName: Joi.string().alphanum().trim().min(3).max(50).required(),
    phoneNumber: Joi.number().required(),
    email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required(),
    addresses: [{ type: Schema.Types.ObjectId, ref: "Address" }],
    role: {
      type: Joi.string().trim(),
      enum: ["SUPERADMIN", "ADMIN", "SALES_REP", "CUSTOMER"],
      unique: true,
      required: true,
    },
    isArchived: {
      type: Joi.boolean(),
      default: false,
    },
    avatar: Joi.string(),
    organization: [{ type: Schema.Types.ObjectId, ref: "Organization" }],
  },
  { timestamps: true }
);
