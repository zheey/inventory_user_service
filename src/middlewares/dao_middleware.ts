import { Request, Response, NextFunction } from "express";
import { checkPayloadAvailable, validatePayload } from "../utils/dao_utils";
import { sendErrorResponse } from "../utils/response_handlers";
import Joi from "joi";
import { IOrganization, ISuperUser } from "../repository/schemas/types";
import { organizationObj } from "../repository/schemas/organization";
import { superUserObj } from "../repository/schemas/user";

export const validateBodyPayload = (validationObj: Joi.ObjectSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const isPayloadAvailable = checkPayloadAvailable(req.body);
    if (!isPayloadAvailable) {
      sendErrorResponse(res, {}, "Payload data empty", 400);
      return;
    }

    const { status, error } = validatePayload(req.body, validationObj);
    if (!status) {
      const message = error?.message ?? "";
      sendErrorResponse(res, {}, message, 400);
      return;
    }

    next();
  };
};

export const validateOrganizatioPayload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orgParams: IOrganization = req.body?.organization;
  const userParams: ISuperUser = req.body?.user;

  const isOrgPayloadAvailable = checkPayloadAvailable(orgParams);
  if (!isOrgPayloadAvailable) {
    sendErrorResponse(res, {}, "Organization Payload data empty", 400);
    return;
  }
  const isUserPayloadAvailable = checkPayloadAvailable(userParams);
  if (!isUserPayloadAvailable) {
    sendErrorResponse(res, {}, "User Payload data empty", 400);
    return;
  }

  const orgRes = validatePayload(orgParams, organizationObj);
  if (!orgRes.status) {
    const message = orgRes.error?.message ?? "";
    sendErrorResponse(res, {}, message, 400);
    return;
  }

  const userRes = validatePayload(userParams, superUserObj);
  if (!userRes.status) {
    const message = userRes.error?.message ?? "";
    sendErrorResponse(res, {}, message, 400);
    return;
  }

  next();
};
