import { User } from "../repository/models";
import { IMongooseId } from "./types/auth_types";

export const findUserWithinOutlet = (query: any, outletId: IMongooseId) => {
  const outletQuery = {
    outletId: { $in: [outletId] },
  };

  const fullQuery = {
    ...query,
    ...outletQuery,
  };

  return User.findOne(fullQuery);
};

export const daoErrorHandler = (errors: any) => {
  if (errors) {
    throw errors;
  }
};
