import { Request, Response } from "express";
import { createNewOutletDAO } from "../dao";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/response_handlers";

export const createOutlet = async (req: Request, res: Response) => {
  try {
    const { status, statusCode, message, data } = await createNewOutletDAO(
      req.body
    );

    if (status) {
      return sendSuccessResponse(res, data, message, statusCode);
    }

    return sendErrorResponse(res, data, message, statusCode);
  } catch (err) {
    return sendErrorResponse(res, {}, `Internal Error. ${err}`, 500);
  }
};
