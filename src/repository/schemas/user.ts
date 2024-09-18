import Joi from "joi";
import "joi-extract-type";

import { Schema } from "mongoose";
import { IUser } from "./types";

export const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: Number, required: false, unique: true },
    email: { type: String, required: false, unique: true },
    password: { type: String, required: true },
    addresses: [{ type: Schema.Types.ObjectId, ref: "Address" }],
    role: {
      type: String,
      required: true,
      enum: ["SUPERADMIN", "ADMIN", "SALES_REP", "CUSTOMER"],
    },
    isArchived: { type: Boolean, required: false, default: false },
    avatar: { type: String, required: false },
    subOutlets: [{ type: Schema.Types.ObjectId, ref: "SubOutlet" }],
  },
  { timestamps: true }
);

export const userObj = Joi.object({
  firstName: Joi.string().alphanum().trim().min(1).max(50).required(),
  lastName: Joi.string().alphanum().trim().min(1).max(50).required(),
  phoneNumber: Joi.number().required(),
  email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required(),
  addresses: [{ type: Schema.Types.ObjectId, ref: "Address" }],
  role: Joi.string()
    .valid(["SUPERADMIN", "ADMIN", "SALES_REP", "CUSTOMER"])
    .required(),
  isArchived: Joi.boolean().default(false),
  avatar: Joi.string(),
  subOutlets: [{ type: Schema.Types.ObjectId, ref: "SubOutlet" }],
});
