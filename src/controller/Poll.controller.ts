import {
  AddPollVoteRequest,
  CreatePollRequest,
} from "./../request/Poll.request";
import { BaseController } from "./Base.controller";
import { HttpStatus } from "../enum/HttpStatus";
import { Request, Response } from "express";
import { IPollService } from "../services/Poll.service";

export class PollController extends BaseController {
  constructor(private pollService: IPollService) {
    super();
  }

  async getPollList(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUserPayload(req);
      const data = await this.pollService.getPollList(user);
      this.successResponse(res, "Success get poll list", HttpStatus.OK, data);
    } catch (error) {
      this.errorResponse(res, error);
    }
  }

  async createPoll(req: Request, res: Response): Promise<void> {
    try {
      const request: CreatePollRequest = req.body;
      const data = await this.pollService.createPoll(request);
      this.successResponse(
        res,
        "Success create poll",
        HttpStatus.CREATED,
        data
      );
    } catch (error) {
      this.errorResponse(res, error);
    }
  }

  async addVote(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const request: AddPollVoteRequest = req.body;
      const user = this.getUserPayload(req);
      const data = await this.pollService.addVote(id, user, request);
      this.successResponse(res, "Success add vote", HttpStatus.CREATED, data);
    } catch (error) {
      this.errorResponse(res, error);
    }
  }
}
