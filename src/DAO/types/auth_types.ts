import { Types } from "mongoose";
import { IAddress } from "../../repository/schemas/types";

export type IMongooseId = string | Types.ObjectId | string[] | undefined;
export type IUserRole = "SUPERADMIN" | "ADMIN" | "SALES_REP" | "CUSTOMER";
export type IEmail = string;
export type IPhoneNumber = number;
export type IPassword = string;

export type IJWTPayload = {
  userId: IMongooseId;
  userRole: IUserRole;
  subOutletId: IMongooseId;
};

export type IUserLoginParam = {
  email?: IEmail;
  phoneNumber?: IPhoneNumber;
  password: IPassword;
  subOutletId: IMongooseId;
};

export type IUserParam = {
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
};
