import { Request, Response } from "express";
import { createrNewUserDAO, userLoginDAO } from "../DAO_";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/response_handlers";
import { isIDAOSuccessResponse } from "../middlewares";

export const createUser = async (req: Request, res: Response) => {
  try {
    const response = await createrNewUserDAO(req.body, req.headers["outletId"]);
    if (isIDAOSuccessResponse(response)) {
      const { status, statusCode, message, data } = response;
      return sendSuccessResponse(res, data, message, statusCode);
    } else {
      const { statusCode, message, error } = response;
      return sendErrorResponse(res, error, message, statusCode);
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
      outletId: req.headers["outletId"],
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
