import { Request, Response } from "express";
import { createNewOrganizationDAO } from "../DAO_";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/response_handlers";

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const { status, statusCode, message, data } =
      await createNewOrganizationDAO(req.body.organization, req.body.user);

    if (status) {
      return sendSuccessResponse(res, data, message, statusCode);
    }

    return sendErrorResponse(res, data, message, statusCode);
  } catch (err) {
    return sendErrorResponse(res, {}, `Internal Error. ${err}`, 500);
  }
};
