import { isIDAOErrorResponse, isSuperUserPayload } from "../middlewares";
import { Address, Organization, Outlet } from "../repository/models";
import { IOutlet } from "../repository/schemas/types";
import { NOT_AUTHORIZED_PERMISSION_DENIED } from "../utils/response";
import { createNewAddressDAO } from "./address";
import { daoErrorHandler } from "./helper";
import { IUserPayload } from "./types";
import { IDAOErrorResponse, IDAOResponse } from "./types/dao_response_types";

export const createNewOutletDAO = async (
  outletParams: IOutlet,
  userPayload?: IUserPayload
): Promise<IDAOResponse | IDAOErrorResponse> => {
  try {
    if (!isSuperUserPayload(userPayload)) {
      return {
        status: false,
        statusCode: 403,
        message: NOT_AUTHORIZED_PERMISSION_DENIED,
        data: {},
      };
    }
    const organization = await Organization.findById({
      _id: userPayload.organizationId,
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

    const suboutletAddress = await createNewAddressDAO(
      outletParams.address,
      userPayload
    );
    if (isIDAOErrorResponse(suboutletAddress)) {
      return suboutletAddress;
    }

    const payload = {
      organizationId: userPayload.organizationId,
      name: outletParams.name,
      address: suboutletAddress.data.id,
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
