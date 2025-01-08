import { Request, Response } from "express";
import { createrNewUserDAO, setUserPasswordDAO, userLoginDAO } from "../DAO_";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/response_handlers";
import {
  isIDAOSuccessResponse,
  isSuperUserPayload,
  isUserPayload,
} from "../middlewares";
import { NOT_AUTHORIZED_PERMISSION_DENIED } from "../utils/response";

export const createUser = async (req: Request, res: Response) => {
  try {
    if (!isSuperUserPayload(req.user)) {
      return sendErrorResponse(res, {}, NOT_AUTHORIZED_PERMISSION_DENIED, 403);
    }
    const response = await createrNewUserDAO(req.body, req.user.organizationId);
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

export const setUserPassword = async (req: Request, res: Response) => {
  try {
    if (!isUserPayload(req.user)) {
      return sendErrorResponse(res, {}, NOT_AUTHORIZED_PERMISSION_DENIED, 403);
    }
    const { password } = req.body;
    const response = await setUserPasswordDAO(req.user?.userId, password);
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

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber, password } = req.body;
    const response = await userLoginDAO({
      email,
      phoneNumber,
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
