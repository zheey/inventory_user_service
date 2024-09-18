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
  let responseData = { message: "", param: "" };
  if (typeof message == "string") {
    responseData["message"] = message;
    message = {};
  }
  responseData = { ...responseData, ...message };

  let data: ResponseDataType = {};
  data["success"] = false;
  data["message"] = responseData;
  data["data"] = content;

  res.status(statusCode).json(data);
};

export const sendSuccessResponse = async (
  res: Response,
  content: ContentType,
  message: MessageType
) => {
  let responseData = { message: "", param: "" };
  if (typeof message == "string") {
    responseData["message"] = message;
    message = {};
  }
  responseData = { ...responseData, ...message };

  let data: ResponseDataType = {};
  data["success"] = true;
  data["message"] = responseData;
  data["data"] = content;
  res.status(200).json(data);
};
