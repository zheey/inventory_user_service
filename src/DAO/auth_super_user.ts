import { Organization, SuperUser } from "../repository/models";
import { ISuperUser } from "../repository/schemas/types";
import { IMongooseId } from "./types/auth_types";
import { IDAOResponse } from "./types/dao_response_types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secret: any = process.env.AUTH_SECRET;
const saltRounds: any = Number(process.env.SALT_ROUNDS);

export const createSuperUserDAO = async (
  userParams: ISuperUser,
  organizationId: IMongooseId
): Promise<IDAOResponse> => {
  try {
    const organization = await Organization.findOne({
      _id: organizationId,
    }).exec();

    if (!organization) {
      return {
        status: false,
        statusCode: 400,
        message: "Organization doesn't exist",
        data: {},
      };
    }

    const secretHash: any = await bcrypt.hash(userParams.secretKey, saltRounds);

    userParams.secretKey = secretHash;
    userParams.organizationId = organization.id;

    const superUser = await SuperUser.create(userParams);
    if (superUser.errors) {
      throw superUser.errors;
    }

    const jwtPayload: any = {
      userId: superUser.id,
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
    console.error(err);
    return {
      status: false,
      statusCode: 500,
      message: `Server Unavailable `,
      data: err,
    };
  }
};

export const verifyOneTimeToken = async (
  userId: IMongooseId,
  organizationId: IMongooseId
) => {
  try {
    const organization = await Organization.findById({ id: organizationId });

    if (!organization) {
      return {
        status: false,
        statusCode: 400,
        message: "Organization doesn't exist",
        data: {},
      };
    }

    const user = await SuperUser.findOne({ _id: userId, organizationId });
    if (!user) {
      return {
        status: false,
        statusCode: 400,
        message: "User doesn't exist",
        data: {},
      };
    }

    if (user.isVerified) {
      return {
        status: false,
        statusCode: 400,
        message: "Invalid Token",
        data: {},
      };
    }

    return {
      status: true,
      statusCode: 200,
      message: "Password not set",
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

export const setSuperUserPasswordDAO = async (
  userId: IMongooseId,
  organizationId: IMongooseId,
  secretKey: string,
  password: string
): Promise<IDAOResponse> => {
  try {
    const organization = await Organization.findById({ id: organizationId });

    if (!organization) {
      return {
        status: false,
        statusCode: 400,
        message: "Organization doesn't exist",
        data: {},
      };
    }

    const user = await SuperUser.findOne({ _id: userId, organizationId });
    if (!user) {
      return {
        status: false,
        statusCode: 400,
        message: "User doesn't exist",
        data: {},
      };
    }

    const isMatch: any = await bcrypt.compare(secretKey, user.secretKey);

    if (!isMatch) {
      return {
        status: false,
        statusCode: 400,
        message: "Incorrect credentials",
        data: {},
      };
    }

    const passwordHash: any = await bcrypt.hash(password, saltRounds);
    await SuperUser.updateOne(
      { _id: userId, organizationId },
      { $set: { password: passwordHash } }
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

// TODO: Generate new token after expiration
