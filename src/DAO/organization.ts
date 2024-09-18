import { Organization } from "../repository/models";
import { OrganizationObj } from "../repository/schemas/organization";
import { IOrganization } from "../repository/schemas/types";
import { checkPayloadAvailable, validatePayload } from "../utils/dao_utils";
import { IDAOResponse } from "./types/dao_response_types";

export const createNewOrganization = async (
  orgParams: IOrganization
): Promise<IDAOResponse> => {
  try {
    orgParams["subOutlets"] = [];
    checkPayloadAvailable(orgParams);
    validatePayload(orgParams, OrganizationObj);

    const existingOrganization = await Organization.findOne({
      name: orgParams.name,
    });

    if (existingOrganization) {
      return { status: 400, message: "Organization already exist" };
    }

    const newOrganization = await Organization.create(orgParams);

    return {
      status: 200,
      message: "Organization successfully created",
      data: newOrganization,
    };
  } catch (err) {
    return { status: 500, message: "Server Unavailable" };
  }
};
