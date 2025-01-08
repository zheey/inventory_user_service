import { IUserRole } from "../DAO_/types";

export type AuthActions = "all" | "super" | "admin";

export const authorizedActions: Record<AuthActions, IUserRole[]> = {
  all: ["ADMIN", "SALES_REP", "SUPERADMIN"],
  super: ["SUPERADMIN"],
  admin: ["ADMIN", "SUPERADMIN"],
};
