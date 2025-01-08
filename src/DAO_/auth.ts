import jwt from "jsonwebtoken";
import { User } from "../repository/models";
import bcrypt from "bcrypt";
import { setUserData } from "../utils/dao_utils";
import {
  IJWTPayload,
  IMongooseId,
  IUserLoginParam,
  IUserParam,
} from "./types/auth_types";
import { IDAOErrorResponse, IDAOResponse } from "./types/dao_response_types";
import { daoErrorHandler, findUserWithinOutlet } from "./helper";
import { IAddress } from "../repository/schemas/types";
import { createNewAddressDAO } from "./address";
import { isIDAOErrorResponse } from "../middlewares";
import { checkIfOutletExist, removeDuplicateUserOutlets } from "./outlet";
import { CREATION_SUCCESSFUL } from "../utils/response";

const secret: any = process.env.AUTH_SECRET;
const saltRounds: any = process.env.SALT_ROUNDS;

export const createrNewUserDAO = async (
  userParams: IUserParam,
  organizationId: IMongooseId
): Promise<IDAOResponse | IDAOErrorResponse> => {
  try {
    const outletResp = await checkIfOutletExist(
      userParams.outlets,
      organizationId
    );
    if (isIDAOErrorResponse(outletResp)) return outletResp;

    let newUserOutlets: IMongooseId[] = outletResp.data;

    const userOutletCheckResp = removeDuplicateUserOutlets(
      newUserOutlets,
      userParams.email,
      userParams.phoneNumber
    );
    if (isIDAOErrorResponse(userOutletCheckResp)) return userOutletCheckResp;

    const hash: any = await bcrypt.hash(userParams.password, saltRounds);
    const userPayload = {
      firstName: userParams.firstName,
      lastName: userParams.lastName,
      phoneNumber: userParams.phoneNumber || "",
      email: userParams.email || "",
      password: hash,
      role: userParams.role,
      outlets: userOutletCheckResp.data,
    };
    userParams.password = hash;
    userParams["outlets"] = newUserOutlets;

    const newUser = await User.create(userPayload);
    daoErrorHandler(newUser?.errors);

    let userAddresses: IAddress[] = [];
    if (userParams.addresses) {
      for (let address of userParams.addresses) {
        const newAddress = await createNewAddressDAO(address, {
          userId: newUser.id,
          userRole: newUser.role,
          outletId: newUserOutlets[0],
        });
        if (isIDAOErrorResponse(newAddress)) {
          return newAddress;
        }

        userAddresses.push(newAddress.data.id);
      }
    }

    if (userAddresses.length > 0) {
      await User.updateOne(
        { _id: newUser.id },
        { $set: { addresses: userAddresses } }
      );
    }

    const resp = {
      id: newUser.id,
      userRole: newUser.role,
      outlets: newUserOutlets,
    };

    return {
      status: true,
      statusCode: 200,
      message: `User ${CREATION_SUCCESSFUL}`,
      data: { user: resp },
    };
  } catch (err) {
    return {
      status: false,
      statusCode: 500,
      message: "Server Unavailable",
      error: err,
    };
  }
};

export const userLoginDAO = async ({
  email,
  phoneNumber,
  password,
  outletId,
}: IUserLoginParam): Promise<IDAOResponse | IDAOErrorResponse> => {
  try {
    if (!email && !phoneNumber) {
      return {
        status: false,
        statusCode: 400,
        message: "Email or Phone Number required",
        data: {},
      };
    }

    if (!outletId) {
      return {
        status: false,
        statusCode: 400,
        message: "Suboutlet ID required",
        data: {},
      };
    }

    const user = await findUserWithinOutlet(
      {
        $or: [{ email }, { phoneNumber }],
      },
      outletId
    );

    daoErrorHandler(user?.errors);

    if (!user) {
      return {
        status: false,
        statusCode: 400,
        message: "User not found",
        data: {},
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        status: false,
        statusCode: 400,
        message: "Incorrect credentials",
        data: {},
      };
    }

    const jwtPayload: IJWTPayload = setUserData(user.id, user.role, outletId);

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
      error: err,
    };
  }
};
