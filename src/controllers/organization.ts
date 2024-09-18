import { Request, Response } from "express";
import { checkPayloadAvailable, validatePayload } from "../utils/dao_utils";
import { organizationObj } from "../repository/schemas/organization";
import { createNewOrganizationDAO } from "../DAO";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/response_handlers";

export const createOrganization = async (req: Request, res: Response) => {
  try {
    req.body["subOutlets"] = [];

    checkPayloadAvailable(res, req.body);
    validatePayload(res, req.body, organizationObj);

    const { status, statusCode, message, data } =
      await createNewOrganizationDAO(req.body);

    if (status) {
      return sendSuccessResponse(res, data, message, statusCode);
    }

    return sendErrorResponse(res, data, message, statusCode);
  } catch (err) {
    return sendErrorResponse(res, {}, `Internal Error. ${err}`, 500);
  }
};
