import { IOrganization, ISubOutlet } from "../../repository/schemas/types";
import { IUserParam } from "./auth_types";

export type IDAOResponse = {
  status: number;
  message: string;
  data?: any;
};

export type IPayload = IUserParam | IOrganization | ISubOutlet;
