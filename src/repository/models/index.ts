import { model } from "mongoose";
import {
  AddressSchema,
  OrganizationSchema,
  SubOutletSchema,
  UserSchema,
} from "../schemas";

export const Address = model("Address", AddressSchema);
export const Organization = model("Organization", OrganizationSchema);
export const SubOutlet = model("SubOutlet", SubOutletSchema);
export const User = model("User", UserSchema);
