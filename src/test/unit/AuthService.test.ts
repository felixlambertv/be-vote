import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role } from "../../enum/Role";
import { InvalidCredential } from "../../exception/Auth.exception";
import { IUserRepository } from "../../repositories/User.repository";
import { LoginRequest } from "../../request/Login.request";
import { AuthService, IAuthService } from "../../services/Auth.service";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Service Test", () => {
  let authService: IAuthService;
  let userRepoMock: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepoMock = {
      getAllUser: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      isEmailExists: jest.fn(),
      findByEmail: jest.fn(),
    };
    authService = new AuthService(userRepoMock);
  });

  describe("login", () => {
    const mockUser = {
      _id: "1234",
      name: "John Doe",
      email: "johndoe@example.com",
      password: "hashedpassword",
      role: Role.ADMIN,
    };

    const loginRequest: LoginRequest = {
      email: "johndoe@example.com",
      password: "password123",
    };

    it("should successfully login with correct email and password", async () => {
      userRepoMock.findByEmail.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.MockedFunction<any>).mockResolvedValueOnce(true);
      (jwt.sign as jest.MockedFunction<any>)
        .mockReturnValueOnce("mockAccessToken")
        .mockReturnValueOnce("mockRefreshToken");

      const result = await authService.login(loginRequest);
      expect(result).toHaveProperty("tokens");
      expect(result).toHaveProperty("user");
      expect(result.tokens.accessToken).toBe("mockAccessToken");
      expect(result.tokens.refreshToken).toBe("mockRefreshToken");
    });

    it("should throw InvalidCredential error when password is incorrect", async () => {
      userRepoMock.findByEmail.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.MockedFunction<any>).mockResolvedValueOnce(false);
      await expect(authService.login(loginRequest)).rejects.toThrow(
        InvalidCredential
      );
    });

    it("should throw InvalidCredential error when email is not found", async () => {
      userRepoMock.findByEmail.mockResolvedValueOnce(null);
      await expect(authService.login(loginRequest)).rejects.toThrow(
        InvalidCredential
      );
    });
  });
});
