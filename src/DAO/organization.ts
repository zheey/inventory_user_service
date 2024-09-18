import { Organization } from "../repository/models";
import { IOrganization } from "../repository/schemas/types";
import { IDAOResponse } from "./types/dao_response_types";

export const createNewOrganizationDAO = async (
  orgParams: IOrganization
): Promise<IDAOResponse> => {
  try {
    const existingOrganization = await Organization.findOne({
      name: orgParams.name,
    });

    if (existingOrganization) {
      return {
        status: false,
        statusCode: 400,
        message: "Organization already exist",
        data: {},
      };
    }

    const newOrganization = await Organization.create(orgParams);

    return {
      status: true,
      statusCode: 200,
      message: "Organization successfully created",
      data: newOrganization,
    };
  } catch (err) {
    return {
      status: false,
      statusCode: 500,
      message: "Server Unavailable",
      data: {},
    };
  }
};
