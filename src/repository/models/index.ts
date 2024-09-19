import { model } from "mongoose";
import {
  AddressSchema,
  OrganizationSchema,
  OutletSchema,
  SuperUserSchema,
  UserSchema,
} from "../schemas";

export const Address = model("Address", AddressSchema);
export const Organization = model("Organization", OrganizationSchema);
export const Outlet = model("Outlet", OutletSchema);
export const User = model("User", UserSchema);
export const SuperUser = model("SuperUser", SuperUserSchema);
