import { Address, Organization, Outlet } from "../repository/models";
import { IOutlet } from "../repository/schemas/types";
import { daoErrorHandler } from "./helper";
import { IDAOErrorResponse, IDAOResponse } from "./types/dao_response_types";

export const createNewOutletDAO = async (
  outletParams: IOutlet
): Promise<IDAOResponse | IDAOErrorResponse> => {
  try {
    const organization = await Organization.findById({
      _id: outletParams.organizationId,
    });

    daoErrorHandler(organization?.errors);

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

    daoErrorHandler(existingSuboutlet?.errors);

    if (existingSuboutlet) {
      return {
        status: false,
        statusCode: 400,
        message: "Suboutlet already exist",
        data: {},
      };
    }

    const suboutletAddress = await Address.create({
      ...outletParams.address,
      organizationId: outletParams.organizationId,
    });
    daoErrorHandler(suboutletAddress?.errors);

    const payload = {
      organizationId: outletParams.organizationId,
      name: outletParams.name,
      address: suboutletAddress.id,
      phoneNumber: outletParams.phoneNumber,
      email: outletParams.email,
    };

    const newSuboutlet = await Outlet.create(payload);
    daoErrorHandler(newSuboutlet?.errors);

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
      data: err,
    };
  }
};
