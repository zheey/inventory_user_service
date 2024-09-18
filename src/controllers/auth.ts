import { Request, Response } from "express";
import { createrNewUserDAO, userLoginDAO } from "../DAO";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/response_handlers";
import { checkPayloadAvailable, validatePayload } from "../utils/dao_utils";
import { userObj } from "../repository/schemas/user";
import { userLoginParamObj } from "./paramsValidationObj";

export const createUser = async (req: Request, res: Response) => {
  try {
    checkPayloadAvailable(res, req.body);
    validatePayload(res, req.body, userObj);

    const { status, statusCode, message, data } = await createrNewUserDAO(
      req.body,
      req.headers["subOutletId"]
    );

    if (status) {
      return sendSuccessResponse(res, data, message, statusCode);
    }

    return sendErrorResponse(res, data, message, statusCode);
  } catch (err) {
    return sendErrorResponse(res, {}, `Internal Error. ${err}`, 500);
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    checkPayloadAvailable(res, req.body);
    const { email, phoneNumber, password } = req.body;

    const payload: any = { phoneNumber, password, email };
    validatePayload(res, payload, userLoginParamObj);

    const { status, statusCode, message, data } = await userLoginDAO({
      email,
      phoneNumber,
      password,
      subOutletId: req.headers["subOutletId"],
    });

    if (status) {
      return sendSuccessResponse(res, data, message, statusCode);
    }

    return sendErrorResponse(res, data, message, statusCode);
  } catch (err) {
    return sendErrorResponse(res, {}, `Internal Error. ${err}`, 500);
  }
};
