import { HttpStatus } from "./../enum/HttpStatus";
import { UserPayload } from "./../types/types.d";
import { Response, Request } from "express";
import BaseException from "../exception/BaseException";
import { BaseResponse } from "./../response/Base.response";
export abstract class BaseController {
  protected successResponse(
    res: Response,
    message: string,
    status: number,
    data?: any
  ): void {
    const response: BaseResponse = {
      success: true,
      message: message,
      data: data,
    };
    res.status(status).json(response);
  }

  protected errorResponse(res: Response, error: any): void {
    if (error instanceof BaseException) {
      const err = error as BaseException;
      const response: BaseResponse = {
        success: false,
        message: err.message,
      };
      res.status(err.statusCode).json(response);
    } else {
      const response: BaseResponse = {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      };
      res.status(500).json(response);
    }
  }

  protected getUserPayload(req: Request): UserPayload {
    const userPayload = req.currentUser;
    if (!userPayload) {
      throw new BaseException("Unauthorize", HttpStatus.UNAUTHORIZED);
    }
    return userPayload;
  }
}
