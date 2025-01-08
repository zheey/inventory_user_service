import { Types } from "mongoose";
import {
  IEmail,
  IMongooseId,
  IPassword,
  IPhoneNumber,
  IUserRole,
} from "../../DAO_/types/auth_types";

export interface IUser {
  firstName: string;
  lastName: string;
  phoneNumber?: IPhoneNumber;
  email?: IEmail;
  password: IPassword;
  addresses?: IAddress[];
  role: IUserRole;
  isArchived?: boolean;
  isPasswordChanged?: boolean;
  avatar?: string;
  outlets?: Types.ObjectId[];
}

export interface ISuperUser {
  email: IEmail;
  password?: IPassword;
  readonly role: IUserRole;
  secretKey: string;
  organizationId: Types.ObjectId;
  readonly isVerified: boolean;
}

export interface IOutlet {
  name: string;
  address: IAddress;
  phoneNumber?: IPhoneNumber;
  email?: IEmail;
  organizationId: Types.ObjectId;
}

export interface IOrganization {
  name: string;
  logo?: string;
  createdByEmail: string;
  outlets?: Types.ObjectId[];
}

export interface IAddress {
  address: string;
  postalCode: string;
  city: string;
  country: string;
  userId?: IMongooseId;
  superUserId?: IMongooseId;
}
