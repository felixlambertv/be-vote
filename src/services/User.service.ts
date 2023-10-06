import { DatabaseException } from "./../exception/Database.exception";
import { DataExistsException } from "./../exception/DataExists.exception";
import { UserRequest } from "./../request/User.request";
import { IUserRepository } from "../repositories/User.repository";
import { User } from "./../model/User.model";
import bcrypt from "bcryptjs";
import NotFoundException from "../exception/NotFoundException";
import { UserResponse } from "../response/User.response";

export interface IUserService {
  getUser(userId: string): Promise<UserResponse>;
  getUserList(): Promise<UserResponse[]>;
  createUser(request: UserRequest): Promise<UserResponse>;
  updateUser(userId: string, request: UserRequest): Promise<UserResponse>;
}

export class UserService implements IUserService {
  private userRepo: IUserRepository;

  constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  async getUser(userId: string): Promise<UserResponse> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException("User");
    }
    return this.userToDto(user);
  }

  async getUserList(): Promise<UserResponse[]> {
    const users = await this.userRepo.getAllUser();
    return users.map(this.userToDto);
  }

  async updateUser(
    userId: string,
    request: UserRequest
  ): Promise<UserResponse> {
    let user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException("User");
    }

    if (user.email != request.email) {
      const isEmailExists = await this.userRepo.isEmailExists(request.email);
      if (isEmailExists) {
        throw new DataExistsException("Email");
      }
    }
    if (request.password) {
      request.password = await bcrypt.hash(request.password, 10);
    }

    const updatedUser = await this.userRepo.update(userId, { ...request });
    if (!updatedUser) {
      throw new DatabaseException("update user");
    }
    return this.userToDto(updatedUser);
  }

  async createUser(request: UserRequest): Promise<UserResponse> {
    const password = await bcrypt.hash(request.password, 10);
    const isEmailExists = await this.userRepo.isEmailExists(request.email);
    if (isEmailExists) {
      throw new DataExistsException("Email");
    }

    let user = {
      name: request.name,
      email: request.email,
      password: password,
      role: request.role,
    };
    user = await this.userRepo.create(user);
    return this.userToDto(user);
  }

  private userToDto(user: User): UserResponse {
    return {
      id: user._id!,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
