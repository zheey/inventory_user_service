import Joi from "joi";
import { Response } from "express";
import { IMongooseId, IUserRole } from "../dao/types/auth_types";
import { IPayload } from "../dao/types/dao_response_types";
import { sendErrorResponse } from "./response_handlers";

export const setUserData = (
  userId: IMongooseId,
  userRole: IUserRole,
  outletId: IMongooseId
) => {
  return {
    userId,
    outletId,
    userRole,
  };
};

export const checkPayloadAvailable = (payload: IPayload): boolean => {
  if (!payload || Object.keys(payload).length === 0) {
    return false;
  }

  return true;
};

export const validatePayload = (
  payload: IPayload,
  validator: Joi.ObjectSchema<any>
) => {
  const { error } = validator.validate(payload);

  if (error) {
    return { status: false, error };
  }

  return { status: true, error: null };
};
