import { DatabaseException } from "./../exception/Database.exception";
import { PollSchema } from "./../database/schema/Poll.schema";
import { Poll, VoteOptions } from "./../model/Poll.model";
import mongoose, { Model } from "mongoose";
import { CreatePollRequest } from "../request/Poll.request";
export interface IPollRepository {
  getAll(): Promise<Poll[]>;
  findById(id: string): Promise<Poll | null>;
  createPoll(request: CreatePollRequest): Promise<Poll>;
  createPollModel(poll: Poll): Promise<Poll>;
  addVote(
    pollId: string,
    userId: string,
    name: string,
    optionIdx: number
  ): Promise<Poll>;
}

export class PollRepository implements IPollRepository {
  private dbInstance: Model<Poll>;
  private tableName: string = "Poll";

  constructor() {
    this.dbInstance = mongoose.model<Poll>(this.tableName, PollSchema);
  }

  async createPollModel(poll: Poll): Promise<Poll> {
    const newPoll = new this.dbInstance(poll);
    return await newPoll.save();
  }

  async addVote(
    pollId: string,
    userId: string,
    name: string,
    optionIdx: number
  ): Promise<Poll> {
    const poll = await this.dbInstance
      .findOneAndUpdate(
        { _id: pollId },
        {
          $push: {
            votes: {
              optionIdx,
              voter: {
                userId: userId,
                name: name,
              },
            },
          },
          $inc: {
            [`options.${optionIdx}.votes`]: 1,
          },
        },
        {
          new: true,
        }
      )
      .exec();

    if (!poll) {
      throw new DatabaseException("Poll");
    }

    return poll;
  }

  async getAll(): Promise<Poll[]> {
    return this.dbInstance.find({}).exec();
  }

  async findById(id: string): Promise<Poll | null> {
    return this.dbInstance.findById(id).exec();
  }

  async createPoll(request: CreatePollRequest): Promise<Poll> {
    const voteOptions: VoteOptions[] = request.options.map((option) => ({
      text: option,
      votes: 0,
    }));

    const newPoll = new this.dbInstance({
      name: request.name,
      options: voteOptions,
      votes: [],
    });
    return await newPoll.save();
  }
}
