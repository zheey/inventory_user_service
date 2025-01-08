import { Request, Response } from "express";
import {
  generateVerificationTokenDAO,
  setSuperUserPasswordDAO,
  superUserLoginDAO,
} from "../DAO_";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/response_handlers";
import { isIDAOSuccessResponse, isSuperUserPayload } from "../middlewares";
import { NOT_AUTHORIZED_PERMISSION_DENIED } from "../utils/response";

export const setSuperUserPassword = async (req: Request, res: Response) => {
  try {
    if (!isSuperUserPayload(req.user)) {
      return sendErrorResponse(res, {}, NOT_AUTHORIZED_PERMISSION_DENIED, 403);
    }
    const { secretKey, password } = req.body;
    const response = await setSuperUserPasswordDAO(
      req.user?.userId,
      req.user?.organizationId,
      secretKey,
      password
    );
    if (isIDAOSuccessResponse(response)) {
      const { statusCode, message, data } = response;
      return sendSuccessResponse(res, data, message, statusCode);
    } else {
      const { statusCode, message, error } = response;
      sendErrorResponse(res, error, message, statusCode);
    }
  } catch (err) {
    return sendErrorResponse(res, {}, `Internal Error. ${err}`, 500);
  }
};

export const userSuperLogin = async (req: Request, res: Response) => {
  try {
    const { email, secretKey, password } = req.body;
    const response = await superUserLoginDAO({
      email,
      secretKey,
      password,
    });

    if (isIDAOSuccessResponse(response)) {
      const { statusCode, message, data } = response;
      return sendSuccessResponse(res, data, message, statusCode);
    } else {
      const { statusCode, message, error } = response;
      return sendErrorResponse(res, error, message, statusCode);
    }
  } catch (err) {
    return sendErrorResponse(res, {}, `Internal Error. ${err}`, 500);
  }
};

export const generateVerificationToken = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, secretKey, userId, organizationId } = req.body;
    const response = await generateVerificationTokenDAO({
      email,
      secretKey,
      userId,
      organizationId,
    });

    if (isIDAOSuccessResponse(response)) {
      const { statusCode, message, data } = response;
      return sendSuccessResponse(res, data, message, statusCode);
    } else {
      const { statusCode, message, error } = response;
      return sendErrorResponse(res, error, message, statusCode);
    }
  } catch (err) {
    console.log(err);
    return sendErrorResponse(res, {}, `Internal Error. ${err}`, 500);
  }
};
