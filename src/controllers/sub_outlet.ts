import { Request, Response } from "express";
import { checkPayloadAvailable, validatePayload } from "../utils/dao_utils";
import { createNewSubOutletDAO } from "../DAO";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/response_handlers";
import { subOutletObj } from "../repository/schemas/sub_outlet";

export const createSubOutlet = async (req: Request, res: Response) => {
  try {
    checkPayloadAvailable(res, req.body);
    validatePayload(res, req.body, subOutletObj);

    const { status, statusCode, message, data } = await createNewSubOutletDAO(
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
