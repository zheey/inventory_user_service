import Joi from "joi";
import { joiObj } from "../repository/schemas/helper";

export const userLoginParamObj = joiObj({
  phoneNumber: Joi.number().required(),
  email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required(),
});

export const superUserLoginObj = joiObj({
  email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required(),
  secretKey: Joi.string().required(),
});

export const superUserUpdateObj = joiObj({
  password: Joi.string().required(),
  secretKey: Joi.string().required(),
});

export const superUserTokenObj = joiObj({
  userId: Joi.string().required(),
  email: Joi.string().required(),
  secretKey: Joi.string().required(),
  organizationId: Joi.string().required(),
});
