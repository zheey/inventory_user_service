import { Organization, Outlet } from "../repository/models";
import { IOutlet } from "../repository/schemas/types";
import { IDAOResponse } from "./types/dao_response_types";

export const createNewOutletDAO = async (
  outletParams: IOutlet
): Promise<IDAOResponse> => {
  try {
    const organization = await Organization.findById({
      id: outletParams.organizationId,
    });

    if (!organization) {
      return {
        status: false,
        statusCode: 400,
        message: "Organization does not exist",
        data: {},
      };
    }

    const existingSuboutlet = await Outlet.findOne({
      name: outletParams.name,
    });

    if (existingSuboutlet) {
      return {
        status: false,
        statusCode: 400,
        message: "Suboutlet already exist",
        data: {},
      };
    }

    const newSuboutlet = await Organization.create(outletParams);
    const organizationSuboutlets = [
      ...(organization.outlets || []),
      newSuboutlet.id,
    ];
    await Organization.updateOne(
      { _id: organization.id },
      { $set: { outlets: organizationSuboutlets } }
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
