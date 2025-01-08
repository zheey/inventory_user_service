import { isSuperUserPayload } from "../middlewares";
import { Address } from "../repository/models";
import { IAddress } from "../repository/schemas/types";
import { daoErrorHandler } from "./helper";
import { IUserPayload } from "./types";
import { IDAOErrorResponse, IDAOResponse } from "./types/dao_response_types";

export const createNewAddressDAO = async (
  addressParams: IAddress,
  userPayload?: IUserPayload
): Promise<IDAOResponse | IDAOErrorResponse> => {
  try {
    const payload = { ...addressParams };
    if (userPayload) {
      const { userId } = userPayload;
      if (isSuperUserPayload(userPayload)) {
        payload["superUserId"] = userId;
      } else {
        payload["userId"] = userId;
      }
    }

    const newddress = await Address.create(payload);
    daoErrorHandler(newddress?.errors);

    return {
      status: true,
      statusCode: 200,
      message: "Address successfully created",
      data: newddress,
    };
  } catch (err) {
    return {
      status: false,
      statusCode: 500,
      message: "Server Unavailable",
      data: err,
    };
  }
};
