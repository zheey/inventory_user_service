import { Organization, SuperUser } from "../repository/models";
import { ISuperUser } from "../repository/schemas/types";
import { daoErrorHandler } from "./helper";
import {
  IEmail,
  IJWTSuperUserPayload,
  IMongooseId,
  ISuperUserLoginParam,
} from "./types/auth_types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IDAOResponse } from "./types/dao_response_types";
import { findOneOrganizationDAO } from ".";

const secret: any = process.env.AUTH_SECRET;
const saltRounds: any = Number(process.env.SALT_ROUNDS);

export const createSuperUserDAO = async (
  userParams: ISuperUser,
  organizationId: IMongooseId
): Promise<IDAOResponse> => {
  try {
    const organization = await findOneOrganizationDAO(organizationId);

    if (!organization.status) {
      return {
        status: false,
        statusCode: 400,
        message: organization.message,
        data: {},
      };
    }

    const secretHash: any = await bcrypt.hash(userParams.secretKey, saltRounds);

    userParams.secretKey = secretHash;
    userParams.organizationId = organization.data?.id;

    const superUser = await SuperUser.create(userParams);
    daoErrorHandler(superUser?.errors);

    const jwtPayload: IJWTSuperUserPayload = {
      userId: superUser.id,
      userRole: superUser.role,
      organizationId: superUser.organizationId,
    };

    const token: string = jwt.sign(jwtPayload, secret, {
      expiresIn: "1h",
    });

    //TODO: Email super-user token for password reset

    return {
      status: true,
      statusCode: 200,
      message: "Authentication successful",
      data: { user: jwtPayload, token },
    };
  } catch (err) {
    return {
      status: false,
      statusCode: 500,
      message: `Server Unavailable `,
      data: err,
    };
  }
};

export const verifySuperUser = async (
  userId: IMongooseId,
  organizationId: IMongooseId,
  secretKey: string,
  email?: IEmail
) => {
  try {
    const organization = await Organization.findById({ _id: organizationId });
    daoErrorHandler(organization?.errors);

    if (!organization) {
      return {
        status: false,
        statusCode: 400,
        message: "Organization doesn't exist",
        data: {},
      };
    }

    const user = await SuperUser.findOne({
      $or: [{ _id: userId }, { email }],
      organizationId,
    });
    daoErrorHandler(user?.errors);

    if (!user) {
      return {
        status: false,
        statusCode: 400,
        message: "User doesn't exist",
        data: {},
      };
    }

    const isSecretMatch = await bcrypt.compare(secretKey, user.secretKey);
    if (!isSecretMatch) {
      return {
        status: false,
        statusCode: 400,
        message: "Incorrect credentials",
        data: {},
      };
    }

    if (user.isVerified) {
      return {
        status: false,
        statusCode: 400,
        message: "User is verified. Cannot be done again",
        data: {},
      };
    }

    return {
      status: true,
      statusCode: 200,
      message: "Password needs to be set",
      data: {},
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

export const setSuperUserPasswordDAO = async (
  userId: IMongooseId,
  organizationId: IMongooseId,
  secretKey: string,
  password: string
): Promise<IDAOResponse> => {
  try {
    const response = await verifySuperUser(
      userId,
      organizationId,
      secretKey,
      ""
    );
    if (!response.status) {
      return response;
    }

    const passwordHash: any = await bcrypt.hash(password, saltRounds);
    await SuperUser.updateOne(
      { _id: userId, organizationId },
      { $set: { password: passwordHash, isVerified: true } }
    );

    return {
      status: true,
      statusCode: 200,
      message: "Authentication successful",
      data: {},
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

export const generateVerificationTokenDAO = async ({
  userId,
  email,
  secretKey,
  organizationId,
}: Omit<ISuperUserLoginParam, "password">): Promise<IDAOResponse> => {
  try {
    const response = await verifySuperUser(
      userId,
      organizationId,
      secretKey,
      email
    );
    if (!response.status) {
      return response;
    }

    const jwtPayload: IJWTSuperUserPayload = {
      userId,
      userRole: "SUPERADMIN",
      organizationId,
    };

    const token = jwt.sign(jwtPayload, secret, {
      expiresIn: "1h",
    });

    //TODO: Email super-user token for password reset

    return {
      status: true,
      statusCode: 200,
      message: "Authentication successful",
      data: { user: jwtPayload, token },
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

export const superUserLoginDAO = async ({
  email,
  secretKey,
  password,
  organizationId,
}: Omit<ISuperUserLoginParam, "userId">): Promise<IDAOResponse> => {
  try {
    const user = await SuperUser.findOne({ email, organizationId });
    daoErrorHandler(user?.errors);

    if (!user) {
      return {
        status: false,
        statusCode: 400,
        message: "User not found",
        data: {},
      };
    }

    const userPassword: any = user?.password;
    const isPasswordMatch = await bcrypt.compare(password, userPassword);
    const isSecretMatch = await bcrypt.compare(secretKey, user.secretKey);
    if (!isPasswordMatch || !isSecretMatch) {
      return {
        status: false,
        statusCode: 400,
        message: "Incorrect credentials",
        data: {},
      };
    }

    const jwtPayload: IJWTSuperUserPayload = {
      userId: user.id,
      userRole: user.role,
      organizationId,
    };

    const token = jwt.sign(jwtPayload, secret, {
      expiresIn: "1h",
    });

    return {
      status: true,
      statusCode: 200,
      message: "Authentication successful",
      data: { user: jwtPayload, token },
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
