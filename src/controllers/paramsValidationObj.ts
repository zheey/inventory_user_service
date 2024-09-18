import Joi from "joi";
import { joiObj } from "../repository/schemas/helper";

export const userLoginParamObj = joiObj({
  phoneNumber: Joi.number().required(),
  email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required(),
});
