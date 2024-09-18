import Joi from "joi";
import { Response } from "express";
import { IMongooseId, IUserRole } from "../DAO/types/auth_types";
import { IPayload } from "../DAO/types/dao_response_types";
import { sendErrorResponse } from "./response_handlers";

export const setUserData = (
  userId: IMongooseId,
  userRole: IUserRole,
  subOutletId: IMongooseId
) => {
  return {
    userId,
    subOutletId,
    userRole,
  };
};

export const checkPayloadAvailable = (res: Response, payload: IPayload) => {
  if (Object.keys(payload).length === 0) {
    return sendErrorResponse(res, {}, "Missing payload data", 400);
  }
};

export const validatePayload = (
  res: Response,
  payload: IPayload,
  validator: Joi.ObjectSchema<any>
) => {
  const { error } = validator.validate(payload);

  if (error) {
    return sendErrorResponse(res, {}, error.message, 400);
  }
};
