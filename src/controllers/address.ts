import { Request, Response } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/response_handlers";
import { isIDAOSuccessResponse } from "../middlewares";
import { createNewAddressDAO } from "../DAO_/address";

export const createAddress = async (req: Request, res: Response) => {
  try {
    const response = await createNewAddressDAO(req.body, req.user);

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
