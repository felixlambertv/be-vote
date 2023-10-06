import { IPollRepository } from "./../repositories/Poll.repository";
import { PollController } from "./../controller/Poll.controller";
import { PollService } from "./../services/Poll.service";
import { UserController } from "./../controller/User.controller";
import { AuthService, IAuthService } from "./../services/Auth.service";
import { IUserService, UserService } from "./../services/User.service";
import {
  UserRepository,
  IUserRepository,
} from "../repositories/User.repository";
import { AuthController } from "../controller/Auth.controller";
import { PollRepository } from "../repositories/Poll.repository";
export function initDependency(): Record<string, any> {
  const userRepository: IUserRepository = new UserRepository();
  const userService: IUserService = new UserService(userRepository);
  const authService: IAuthService = new AuthService(userRepository);

  const authController: AuthController = new AuthController(authService);

  const userController: UserController = new UserController(userService);

  const pollRepository: IPollRepository = new PollRepository();
  const pollService: PollService = new PollService(pollRepository);
  const pollController: PollController = new PollController(pollService);

  return {
    authController,
    userController,
    pollController,
  };
}
