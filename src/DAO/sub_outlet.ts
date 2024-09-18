import { Organization, SubOutlet } from "../repository/models";
import { ISubOutlet } from "../repository/schemas/types";
import { IDAOResponse } from "./types/dao_response_types";

export const createNewSubOutletDAO = async (
  subOutletParams: ISubOutlet
): Promise<IDAOResponse> => {
  try {
    const organization = await Organization.findById({
      id: subOutletParams.organizationId,
    });

    if (!organization) {
      return {
        status: false,
        statusCode: 400,
        message: "Organization does not exist",
        data: {},
      };
    }

    const existingSuboutlet = await SubOutlet.findOne({
      name: subOutletParams.name,
    });

    if (existingSuboutlet) {
      return {
        status: false,
        statusCode: 400,
        message: "Suboutlet already exist",
        data: {},
      };
    }

    const newSuboutlet = await Organization.create(subOutletParams);
    const organizationSuboutlets = [
      ...organization.subOutlets,
      newSuboutlet.id,
    ];
    await Organization.updateOne(
      { _id: organization.id },
      { $set: { subOutlets: organizationSuboutlets } }
    );

    return {
      status: true,
      statusCode: 200,
      message: "Suboutlet successfully created",
      data: newSuboutlet,
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
