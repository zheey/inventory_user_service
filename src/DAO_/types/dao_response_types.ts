import {
  IOrganization,
  IOutlet,
  ISuperUser,
} from "../../repository/schemas/types";
import { IUserParam } from "./auth_types";

export type IDAOResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: any;
};

export type IPayload = IUserParam | IOrganization | IOutlet | ISuperUser;
