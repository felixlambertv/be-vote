import { IAuthService } from "../services/Auth.service";
import { LoginRequest } from "../request/Login.request";
import { Request, Response } from "express";
import { BaseController } from "./Base.controller";
import { HttpStatus } from "../enum/HttpStatus";

export class AuthController extends BaseController {
  constructor(private authService: IAuthService) {
    super();
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const request: LoginRequest = req.body;
      const data = await this.authService.login(request);
      this.successResponse(res, "Success login", HttpStatus.OK, data);
    } catch (error) {
      this.errorResponse(res, error);
    }
  }
}
