import { Request, Response } from "express";
import {
  generateVerificationTokenDAO,
  setSuperUserPasswordDAO,
  superUserLoginDAO,
} from "../DAO_";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/response_handlers";

export const setSuperUserPassword = async (req: Request, res: Response) => {
  try {
    const { secretKey, password } = req.body;
    const { status, statusCode, message, data } = await setSuperUserPasswordDAO(
      req.user?.userId,
      req.user?.organizationId,
      secretKey,
      password
    );
    if (status) {
      return sendSuccessResponse(res, data, message, statusCode);
    }
    sendErrorResponse(res, data, message, statusCode);
  } catch (err) {
    return sendErrorResponse(res, {}, `Internal Error. ${err}`, 500);
  }
};

export const userSuperLogin = async (req: Request, res: Response) => {
  try {
    const { email, secretKey, password } = req.body;
    const { status, statusCode, message, data } = await superUserLoginDAO({
      email,
      secretKey,
      password,
      organizationId: req.headers["organizationId"],
    });

    if (status) {
      return sendSuccessResponse(res, data, message, statusCode);
    }

    return sendErrorResponse(res, data, message, statusCode);
  } catch (err) {
    return sendErrorResponse(res, {}, `Internal Error. ${err}`, 500);
  }
};

export const generateVerificationToken = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, secretKey, userId, organizationId } = req.body;
    const { status, statusCode, message, data } =
      await generateVerificationTokenDAO({
        email,
        secretKey,
        userId,
        organizationId,
      });
    if (status) {
      return sendSuccessResponse(res, data, message, statusCode);
    }
    sendErrorResponse(res, data, message, statusCode);
  } catch (err) {
    console.log(err);
    return sendErrorResponse(res, {}, `Internal Error. ${err}`, 500);
  }
};
