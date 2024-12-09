import { IUserRole } from "../DAO_/types";

export type AuthActions = "all";

export const authorizedActions: Record<AuthActions, IUserRole[]> = {
  all: [],
};
