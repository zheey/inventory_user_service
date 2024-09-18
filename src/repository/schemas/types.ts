import { Types } from "mongoose";
import {
  IEmail,
  IPassword,
  IPhoneNumber,
  IUserRole,
} from "../../DAO/types/auth_types";
export interface IUser {
  firstName: string;
  lastName: string;
  phoneNumber?: IPhoneNumber;
  email?: IEmail;
  password: IPassword;
  addresses?: IAddress[];
  role: IUserRole;
  isArchived?: boolean;
  avatar?: string;
  subOutlets: Types.ObjectId[];
}

export interface ISubOutlet {
  name: string;
  address: Types.ObjectId;
  phoneNumber?: IPhoneNumber;
  email?: IEmail;
  organizationId: Types.ObjectId;
}

export interface IOrganization {
  name: string;
  logo?: string;
  subOutlets: Types.ObjectId[];
}

export interface IAddress {
  address: string;
  postalCode: string;
  city: string;
  country: string;
}
