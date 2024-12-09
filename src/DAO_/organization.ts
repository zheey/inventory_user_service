import { Organization } from "../repository/models";
import { IOrganization, ISuperUser } from "../repository/schemas/types";
import { createSuperUserDAO } from ".";
import { IDAOResponse } from "./types/dao_response_types";
import { daoErrorHandler } from "./helper";
import { IMongooseId } from "./types/auth_types";

export const createNewOrganizationDAO = async (
  orgParams: Omit<IOrganization, "createdByEmail">,
  userParams: ISuperUser
): Promise<IDAOResponse> => {
  try {
    const existingOrganization = await Organization.findOne(
      {
        name: orgParams.name,
      },
      { new: true }
    ).exec();

    daoErrorHandler(existingOrganization?.errors);

    if (existingOrganization) {
      return {
        status: false,
        statusCode: 400,
        message: "Organization already exist",
        data: {},
      };
    }

    //TODO:
    /**
     * Revert simulteneous processes. (Use transaction)
     * */

    const newOrganization = await Organization.create({
      ...orgParams,
      createdByEmail: userParams.email,
    });

    daoErrorHandler(newOrganization?.errors);

    const newSuperUser = await createSuperUserDAO(
      userParams,
      newOrganization.id
    );

    if (!newSuperUser.status) {
      throw new Error(newSuperUser.message);
    }

    return {
      status: true,
      statusCode: 200,
      message: "Organization successfully created",
      data: { ...newOrganization.toJSON(), ...newSuperUser.data },
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

export const findOneOrganizationDAO = async (
  organizationId: IMongooseId
): Promise<IDAOResponse> => {
  try {
    const organization = await Organization.findOne({
      _id: organizationId,
    }).exec();

    daoErrorHandler(organization?.errors);

    if (!organization) {
      return {
        status: false,
        statusCode: 400,
        message: "Organization doesn't exist",
        data: {},
      };
    }

    return {
      status: true,
      statusCode: 200,
      message: "Organization successfully created",
      data: organization,
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
