import Joi from "joi";
import { IMongooseId, IUserRole } from "../DAO/types/auth_types";
import { IPayload } from "../DAO/types/dao_response_types";

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

export const checkPayloadAvailable = (payload: IPayload) => {
  if (Object.keys(payload).length === 0) {
    return { status: 400, message: "Missing payload data" };
  }
};

export const validatePayload = (
  payload: IPayload,
  validator: Joi.ObjectSchema<any>
) => {
  const { error } = validator.validate(payload);

  if (error) {
    return { status: 400, message: error.details };
  }
};
