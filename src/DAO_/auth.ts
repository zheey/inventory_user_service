import jwt from "jsonwebtoken";
import { Organization, Outlet, SuperUser, User } from "../repository/models";
import bcrypt from "bcrypt";
import { setUserData } from "../utils/dao_utils";
import {
  IJWTPayload,
  IMongooseId,
  IUserLoginParam,
  IUserParam,
} from "./types/auth_types";
import { IDAOResponse } from "./types/dao_response_types";
import { daoErrorHandler, findUserWithinOutlet } from "./helper";

const secret: any = process.env.AUTH_SECRET;
const saltRounds: any = process.env.SALT_ROUNDS;

export const createrNewUserDAO = async (
  userParams: IUserParam,
  outletId: IMongooseId
): Promise<IDAOResponse> => {
  try {
    const existingUser = await findUserWithinOutlet(
      {
        $or: [
          { email: userParams.email },
          { phoneNumber: userParams.phoneNumber },
        ],
      },
      outletId
    );
    daoErrorHandler(existingUser?.errors);

    if (existingUser) {
      return {
        status: false,
        statusCode: 400,
        message: "Duplicate Email or Phone Number",
        data: {},
      };
    }

    const hash: any = await bcrypt.hash(userParams.password, saltRounds);
    userParams.password = hash;

    const outlet = await Outlet.findById({ id: outletId });

    daoErrorHandler(outlet?.errors);

    if (!outlet) {
      return {
        status: false,
        statusCode: 400,
        message: "Organization or Outlet doesn't exist",
        data: {},
      };
    }

    userParams["outlets"] = [outlet.id];

    const newUser = await User.create(userParams);

    daoErrorHandler(newUser?.errors);

    const jwtPayload: IJWTPayload = setUserData(
      newUser.id,
      newUser.role,
      outletId
    );

    const token: string = jwt.sign(jwtPayload, secret, {
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

export const userLoginDAO = async ({
  email,
  phoneNumber,
  password,
  outletId,
}: IUserLoginParam): Promise<IDAOResponse> => {
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
      data: {},
    };
  }
};
