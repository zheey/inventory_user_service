import Joi from "joi";

export const joiObj = (schemaObj: any) =>
  Joi.object(schemaObj).options({ stripUnknown: true });
