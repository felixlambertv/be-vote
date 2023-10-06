import { LoginResponse } from "./../response/Auth.response";
import { InvalidCredential } from "./../exception/Auth.exception";
import { IUserRepository } from "../repositories/User.repository";
import { LoginRequest } from "./../request/Login.request";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/vars";
import { UserPayload } from "../types/types";

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthService {
  login(request: LoginRequest): Promise<LoginResponse>;
}

export class AuthService implements IAuthService {
  constructor(private userRepo: IUserRepository) {}

  async login(request: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepo.findByEmail(request.email);
    if (!user || !(await bcrypt.compare(request.password, user.password))) {
      throw new InvalidCredential();
    }
    const userPayload: UserPayload = {
      userId: user._id!,
      name: user.name,
      role: user.role,
    };

    const accessToken = jwt.sign(userPayload, config.accessTokenSecret, {
      expiresIn: config.accessTokenExpiry,
    });
    const refreshToken = jwt.sign(userPayload, config.refreshTokenSecret, {
      expiresIn: config.refreshTokenExpiry,
    });

    return {
      tokens: { accessToken, refreshToken },
      user: userPayload,
    };
  }
}
