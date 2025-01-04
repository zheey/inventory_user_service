import { Request, Response } from "express";
import { createNewOutletDAO } from "../DAO_";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/response_handlers";
import { isIDAOSuccessResponse } from "../middlewares";

export const createOutlet = async (req: Request, res: Response) => {
  try {
    const response = await createNewOutletDAO(req.body);

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
