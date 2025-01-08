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
import { checkIfOutletExist } from "./outlet";
import {
  CREATION_SUCCESSFUL,
  PASSWORD_CHANGE_SUCCESSFUL,
  USER_NOT_FOUND,
  USER_VERIFICATION_ERROR,
} from "../utils/response";

const secret: any = process.env.AUTH_SECRET;
const saltRounds: number = Number(process.env.SALT_ROUNDS);

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

    const hash: any = await bcrypt.hash(userParams.password, saltRounds);
    const userPayload = {
      firstName: userParams.firstName,
      lastName: userParams.lastName,
      phoneNumber: userParams.phoneNumber || "",
      email: userParams.email || "",
      password: hash,
      role: userParams.role,
      outlets: newUserOutlets,
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
      address: userAddresses,
    };

    //TODO: Send change password link to either email or through SMS

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

export const setUserPasswordDAO = async (
  userId: IMongooseId,
  password: string
): Promise<IDAOResponse | IDAOErrorResponse> => {
  try {
    const passwordHash: any = await bcrypt.hash(password, saltRounds);
    const user = await User.findById(userId);

    if (user?.isPasswordChanged) {
      return {
        status: false,
        statusCode: 400,
        message: USER_VERIFICATION_ERROR,
        error: {},
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: passwordHash, isPasswordChanged: true },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return {
        status: false,
        statusCode: 400,
        message: USER_NOT_FOUND,
        error: {},
      };
    }

    const jwtPayload: IJWTPayload = setUserData(
      updatedUser.id,
      updatedUser.role,
      updatedUser.outlets[0]
    );

    const token = jwt.sign(jwtPayload, secret, {
      expiresIn: "1h",
    });

    return {
      status: true,
      statusCode: 200,
      message: PASSWORD_CHANGE_SUCCESSFUL,
      data: { token },
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

//TODO:Enforce password change

export const userLoginDAO = async ({
  email,
  phoneNumber,
  password,
}: Omit<IUserLoginParam, "outletId">): Promise<
  IDAOResponse | IDAOErrorResponse
> => {
  try {
    if (!email && !phoneNumber) {
      return {
        status: false,
        statusCode: 400,
        message: "Email or Phone Number required",
        error: {},
      };
    }

    const user = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    daoErrorHandler(user?.errors);

    if (!user) {
      return {
        status: false,
        statusCode: 400,
        message: "User not found",
        error: {},
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        status: false,
        statusCode: 400,
        message: "Incorrect credentials",
        error: {},
      };
    }

    const jwtPayload: IJWTPayload = setUserData(
      user.id,
      user.role,
      user.outlets[0]
    );

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
