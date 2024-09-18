import { Organization, SubOutlet } from "../repository/models";
import { SubOutletObj } from "../repository/schemas/sub_outlet";
import { ISubOutlet } from "../repository/schemas/types";
import { checkPayloadAvailable, validatePayload } from "../utils/dao_utils";
import { IDAOResponse } from "./types/dao_response_types";

export const createNewSubOutlet = async (
  subOutletParams: ISubOutlet
): Promise<IDAOResponse> => {
  try {
    checkPayloadAvailable(subOutletParams);
    validatePayload(subOutletParams, SubOutletObj);

    const organization = await Organization.findById({
      id: subOutletParams.organizationId,
    });

    if (!organization) {
      return { status: 400, message: "Organization does not exist" };
    }

    const existingSuboutlet = await SubOutlet.findOne({
      name: subOutletParams.name,
    });

    if (existingSuboutlet) {
      return { status: 400, message: "Suboutlet already exist" };
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
      status: 200,
      message: "Suboutlet successfully created",
      data: newSuboutlet,
    };
  } catch (err) {
    return { status: 500, message: "Server Unavailable" };
  }
};
