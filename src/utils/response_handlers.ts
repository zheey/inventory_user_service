import type { Response } from "express";

type ContentType = string | string[] | { [key: string]: string };
type MessageType = string | { [key: string]: string };
type ResponseDataType = {
  success?: boolean;
  message?: MessageType;
  data?: ContentType;
};

export const sendErrorResponse = async (
  res: Response,
  content: ContentType,
  message: MessageType,
  statusCode?: number
) => {
  statusCode = !statusCode ? 400 : statusCode;

  let data: ResponseDataType = {};
  data["success"] = false;
  data["message"] = message;
  data["data"] = content;

  res.status(statusCode).json(data);
  return;
};

export const sendSuccessResponse = async (
  res: Response,
  content: ContentType,
  message: MessageType,
  statusCode?: number
) => {
  let data: ResponseDataType = {};
  data["success"] = true;
  data["message"] = message;
  data["data"] = content;
  res.status(statusCode || 200).json(data);
  return;
};
