import { Organization } from "../repository/models";
import { IOrganization, ISuperUser } from "../repository/schemas/types";
import { createSuperUserDAO } from ".";
import { IDAOResponse } from "./types/dao_response_types";

export const createNewOrganizationDAO = async (
  orgParams: IOrganization,
  userParams: ISuperUser
): Promise<IDAOResponse> => {
  try {
    const existingOrganization = await Organization.findOne(
      {
        name: orgParams.name,
      },
      { new: true }
    ).exec();

    if (existingOrganization?.errors) {
      throw existingOrganization?.errors;
    }

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
     * Return JSON response
     * Handle all errors to reflect in error message
     * Revert simulteneous processes. (Use transaction)
     * Structure DAO responses to return JSON
     * */

    const newOrganization = await Organization.create(orgParams);
    if (newOrganization?.errors) {
      throw newOrganization.errors;
    }
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
