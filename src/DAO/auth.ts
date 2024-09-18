import jwt from "jsonwebtoken";
import { SubOutlet, User } from "../repository/models";
import bcrypt from "bcrypt";
import {
  checkPayloadAvailable,
  setUserData,
  validatePayload,
} from "../utils/dao_utils";
import {
  IJWTPayload,
  IMongooseId,
  IUserLoginParam,
  IUserParam,
} from "./types/auth_types";
import { IDAOResponse } from "./types/dao_response_types";
import { findUserWithinSubOutlet } from "./helper";
import { userObj } from "../repository/schemas/user";

const secret: any = process.env.AUTH_SECRET;
const saltRounds: any = process.env.SALT_ROUNDS;

export const createrNewUser = async (
  userParams: IUserParam,
  subOutletId: IMongooseId
): Promise<IDAOResponse> => {
  try {
    checkPayloadAvailable(userParams);
    validatePayload(userParams, userObj);

    const existingUser = await findUserWithinSubOutlet(
      {
        $or: [
          { email: userParams.email },
          { phoneNumber: userParams.phoneNumber },
        ],
      },
      subOutletId
    );
    if (existingUser) {
      return { status: 400, message: "Duplicate Email or Phone Number" };
    }

    const hash: any = await bcrypt.hash(userParams.password, saltRounds);
    userParams.password = hash;

    const subOutlet = await SubOutlet.findById({ id: subOutletId });

    if (!subOutlet) {
      return { status: 400, message: "Organization or Outlet doesn't exist" };
    }

    userParams["subOutlets"] = [subOutlet.id];

    const newUser = await User.create(userParams);

    const jwtPayload: IJWTPayload = setUserData(
      newUser.id,
      newUser.role,
      subOutletId
    );

    const token: string = jwt.sign(jwtPayload, secret, {
      expiresIn: "1h",
    });

    return {
      status: 200,
      message: "Authentication successful",
      data: { jwtPayload, token },
    };
  } catch (err) {
    return { status: 500, message: "Server Unavailable" };
  }
};

export const userLogin = async ({
  email,
  phoneNumber,
  password,
  subOutletId,
}: IUserLoginParam): Promise<IDAOResponse> => {
  try {
    if (!email && !phoneNumber) {
      return { status: 400, message: "Email or Phone Number required" };
    }

    if (!subOutletId) {
      return { status: 400, message: "Suboutlet ID required" };
    }

    const user = await findUserWithinSubOutlet(
      {
        $or: [{ email }, { phoneNumber }],
      },
      subOutletId
    );

    if (!user) {
      return { status: 400, message: "User not found" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { status: 400, message: "Incorrect credentials" };
    }

    const jwtPayload: IJWTPayload = setUserData(
      user.id,
      user.role,
      subOutletId
    );

    const token = jwt.sign(jwtPayload, secret, {
      expiresIn: "1h",
    });

    return {
      status: 200,
      message: "Authentication successful",
      data: { jwtPayload, token },
    };
  } catch (err) {
    return { status: 500, message: "Server Unavailable" };
  }
};
