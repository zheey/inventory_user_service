import Joi from "joi";
import { Schema } from "mongoose";
import { ISuperUser, IUser } from "./types";
import { joiObj } from "./helper";

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
    outlets: [{ type: Schema.Types.ObjectId, ref: "Outlet" }],
  },
  { timestamps: true }
);

export const SuperUserSchema = new Schema<ISuperUser>(
  {
    email: { type: String, required: true },
    password: { type: String },
    role: {
      type: String,
      default: "SUPERADMIN",
    },
    secretKey: { type: String, required: true },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const userObj = joiObj({
  firstName: Joi.string().alphanum().trim().min(1).max(50).required(),
  lastName: Joi.string().alphanum().trim().min(1).max(50).required(),
  phoneNumber: Joi.number().required(),
  email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required(),
  addresses: Joi.array(),
  role: Joi.string()
    .valid("SUPERADMIN", "ADMIN", "SALES_REP", "CUSTOMER")
    .required(),
  isArchived: Joi.boolean().default(false),
  avatar: Joi.string(),
  outlets: Joi.array(),
});

export const superUserObj = joiObj({
  email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
  password: Joi.string(),
  role: Joi.string().valid("SUPERADMIN"),
  isVerified: Joi.boolean().default(false),
  secretKey: Joi.string().required(),
  organizationId: Joi.string(),
});
