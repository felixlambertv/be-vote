import { Role } from "./../../enum/Role";
import { User } from "./../../model/User.model";
import { UserService } from "./../../services/User.service";
import bcrypt from "bcryptjs";
import { IUserRepository } from "../../repositories/User.repository";
import NotFoundException from "../../exception/NotFoundException";
import { UserRequest } from "../../request/User.request";
import { DataExistsException } from "../../exception/DataExists.exception";
import { DatabaseException } from "../../exception/Database.exception";

jest.mock("bcryptjs");

describe("User Service Test", () => {
  let userService: UserService;
  let userRepoMock: jest.Mocked<IUserRepository>;
  const userId = "abcdef123456abcdef123456";

  beforeEach(() => {
    userRepoMock = {
      getAllUser: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      isEmailExists: jest.fn(),
      findByEmail: jest.fn(),
    };

    userService = new UserService(userRepoMock);
  });

  describe("getUser", () => {
    it("should success return user when found", async () => {
      const mockUser: User = {
        _id: userId,
        name: "Name",
        email: "email@mail.com",
        role: Role.USER,
        password: "password",
      };

      userRepoMock.findById.mockResolvedValueOnce(mockUser);
      const result = await userService.getUser(userId);
      expect(userRepoMock.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        id: userId,
        name: "Name",
        email: "email@mail.com",
        role: Role.USER,
      });
    });

    it("should throw NotFoundException when user not found", async () => {
      userRepoMock.findById.mockResolvedValueOnce(null);
      await expect(userService.getUser(userId)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("getUserList", () => {
    it("should return a list of UserResponses when there are users", async () => {
      const mockUsers: User[] = [
        {
          _id: "1",
          name: "John",
          email: "john@example.com",
          role: Role.USER,
          password: "password",
        },
        {
          _id: "2",
          name: "Doe",
          email: "doe@example.com",
          role: Role.ADMIN,
          password: "password",
        },
      ];
      userRepoMock.getAllUser.mockResolvedValueOnce(mockUsers);

      const result = await userService.getUserList();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: "1",
        name: "John",
        email: "john@example.com",
        role: Role.USER,
      });
      expect(result[1]).toEqual({
        id: "2",
        name: "Doe",
        email: "doe@example.com",
        role: Role.ADMIN,
      });
    });

    it("should return an empty list when there are no users", async () => {
      userRepoMock.getAllUser.mockResolvedValueOnce([]);
      const result = await userService.getUserList();
      expect(result).toHaveLength(0);
    });
  });

  describe("createUser", () => {
    const request: UserRequest = {
      name: "NewName",
      email: "newemail@mail.com",
      password: "password",
      role: Role.ADMIN,
    };

    it("should successfully create a user", async () => {
      const createdUser = {
        ...request,
        _id: userId,
      };
      userRepoMock.isEmailExists.mockResolvedValueOnce(false);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce(request.password);
      userRepoMock.create.mockResolvedValueOnce(createdUser);

      const result = await userService.createUser(request);
      expect(userRepoMock.create).toHaveBeenCalledWith({
        name: request.name,
        email: request.email,
        role: request.role,
        password: request.password,
      });

      expect(result).toEqual({
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
      });
    });

    it("should throw DataExistsException when email already exists", async () => {
      userRepoMock.isEmailExists.mockResolvedValueOnce(true);
      await expect(userService.createUser(request)).rejects.toThrow(
        DataExistsException
      );
    });
  });

  describe("updateUser", () => {
    const existingUser: User = {
      _id: userId,
      name: "name",
      email: "email@mail.com",
      role: Role.ADMIN,
      password: "password",
    };

    const request: UserRequest = {
      name: "NewName",
      email: "newemail@mail.com",
      password: "password",
      role: Role.ADMIN,
    };

    it("should success update the user", async () => {
      const updateUser = { ...existingUser, ...request };
      userRepoMock.findById.mockResolvedValueOnce(existingUser);
      userRepoMock.isEmailExists.mockResolvedValueOnce(false);
      userRepoMock.update.mockResolvedValueOnce(updateUser);

      (bcrypt.hash as jest.Mock).mockResolvedValueOnce(request.password);

      const result = await userService.updateUser(userId, request);
      expect(bcrypt.hash).toHaveBeenCalledWith(request.password, 10);
      expect(userRepoMock.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        id: updateUser._id,
        name: updateUser.name,
        email: updateUser.email,
        role: updateUser.role,
      });
    });

    it("should throw NotFoundException when user not found", async () => {
      userRepoMock.findById.mockResolvedValueOnce(null);

      await expect(userService.updateUser(userId, request)).rejects.toThrow(
        NotFoundException
      );
    });

    it("should throw DataExistsException when email already exists", async () => {
      userRepoMock.findById.mockResolvedValueOnce(existingUser);
      userRepoMock.isEmailExists.mockResolvedValueOnce(true);

      await expect(userService.updateUser(userId, request)).rejects.toThrow(
        DataExistsException
      );
    });

    it("should throw DatabaseException when update fails", async () => {
      userRepoMock.findById.mockResolvedValueOnce(existingUser);
      userRepoMock.isEmailExists.mockResolvedValueOnce(false);
      userRepoMock.update.mockResolvedValueOnce(null);

      await expect(userService.updateUser(userId, request)).rejects.toThrow(
        DatabaseException
      );
    });
  });
});
