import { User } from "../repository/models";
import { IMongooseId } from "./types/auth_types";

export const findUserWithinSubOutlet = (
  query: any,
  subOutletId: IMongooseId
) => {
  const subOutletQuery = {
    subOutletId: { $in: [subOutletId] },
  };

  const fullQuery = {
    ...query,
    ...subOutletQuery,
  };

  return User.findOne(fullQuery);
};
