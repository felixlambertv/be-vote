import { HttpStatus } from "./../enum/HttpStatus";
import { UserRequest } from "./../request/User.request";
import { IUserService } from "./../services/User.service";
import { Request, Response } from "express";
import { BaseController } from "./Base.controller";

export class UserController extends BaseController {
  constructor(private userService: IUserService) {
    super();
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const request: UserRequest = req.body;
      const data = await this.userService.createUser(request);
      this.successResponse(
        res,
        "Success create user",
        HttpStatus.CREATED,
        data
      );
    } catch (error) {
      this.errorResponse(res, error);
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const data = await this.userService.getUser(id);
      this.successResponse(res, "Success get user", HttpStatus.OK, data);
    } catch (error) {
      this.errorResponse(res, error);
    }
  }

  async getAllUser(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.userService.getUserList();
      this.successResponse(res, "Success get all user", HttpStatus.OK, data);
    } catch (error) {
      this.errorResponse(res, error);
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const request: UserRequest = req.body;
      const id = req.params.id;
      const data = await this.userService.updateUser(id, request);
      this.successResponse(res, "Success update user", HttpStatus.OK, data);
    } catch (error) {
      this.errorResponse(res, error);
    }
  }
}
