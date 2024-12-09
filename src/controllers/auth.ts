import { Request, Response } from "express";
import { createrNewUserDAO, userLoginDAO } from "../DAO_";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/response_handlers";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { status, statusCode, message, data } = await createrNewUserDAO(
      req.body,
      req.headers["outletId"]
    );
    if (status) {
      return sendSuccessResponse(res, data, message, statusCode);
    }
    sendErrorResponse(res, data, message, statusCode);
  } catch (err) {
    return sendErrorResponse(res, {}, `Internal Error. ${err}`, 500);
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber, password } = req.body;
    const { status, statusCode, message, data } = await userLoginDAO({
      email,
      phoneNumber,
      password,
      outletId: req.headers["outletId"],
    });

    if (status) {
      return sendSuccessResponse(res, data, message, statusCode);
    }

    return sendErrorResponse(res, data, message, statusCode);
  } catch (err) {
    return sendErrorResponse(res, {}, `Internal Error. ${err}`, 500);
  }
};
