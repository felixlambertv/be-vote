import { AddPollVoteRequest } from "./../request/Poll.request";
import { DatabaseException } from "./../exception/Database.exception";
import { UserPayload } from "./../types/types.d";
import { CreatePollRequest } from "../request/Poll.request";
import { IPollRepository } from "../repositories/Poll.repository";
import { AdminPollResponse, UserPollResponse } from "../response/Poll.response";
import { Role } from "../enum/Role";
import { Poll, VoteOptions, Votes } from "../model/Poll.model";
import NotFoundException from "../exception/NotFoundException";
import BaseException from "../exception/BaseException";

export interface IPollService {
  getPollList(
    user: UserPayload
  ): Promise<AdminPollResponse[] | UserPollResponse[]>;
  createPoll(request: CreatePollRequest): Promise<AdminPollResponse>;
  addVote(
    id: string,
    user: UserPayload,
    request: AddPollVoteRequest
  ): Promise<UserPollResponse>;
}

export class PollService implements IPollService {
  constructor(private pollRepo: IPollRepository) {}

  async addVote(
    id: string,
    user: UserPayload,
    request: AddPollVoteRequest
  ): Promise<UserPollResponse> {
    let poll = await this.pollRepo.findById(id);
    if (!poll) {
      throw new NotFoundException("Poll");
    }

    if (request.optionIdx < 0 || request.optionIdx >= poll.options.length) {
      throw new BaseException("Invalid option value");
    }

    const isUserAlreadyVote = this.isUserAlreadyVote(user.userId, poll.votes);
    if (isUserAlreadyVote) {
      throw new BaseException("User already voted");
    }

    poll = await this.pollRepo.addVote(
      poll._id!,
      user.userId,
      request.name,
      request.optionIdx
    );

    return this.mapPollToUserResponse(poll, true);
  }

  async getPollList(
    user: UserPayload
  ): Promise<AdminPollResponse[] | UserPollResponse[]> {
    const pollList: Poll[] = await this.pollRepo.getAll();
    if (user.role == Role.ADMIN) {
      return pollList.map(this.mapPollToAdminResponse);
    } else {
      return pollList.map((poll) => {
        const isUserAlreadyVote = this.isUserAlreadyVote(
          user.userId,
          poll.votes
        );
        return this.mapPollToUserResponse(poll, isUserAlreadyVote);
      });
    }
  }

  async createPoll(request: CreatePollRequest): Promise<AdminPollResponse> {
    try {
      const voteOptions: VoteOptions[] = request.options.map((option) => ({
        text: option,
        votes: 0,
      }));

      let poll: Poll = {
        name: request.name,
        options: voteOptions,
        votes: [],
      };

      poll = await this.pollRepo.createPollModel(poll);
      return this.mapPollToAdminResponse(poll);
    } catch (error) {
      throw new DatabaseException("Poll");
    }
  }

  private mapPollToAdminResponse(poll: Poll): AdminPollResponse {
    const mostVotedOption = poll.options.reduce(
      (highestVoteOption, currentOption) =>
        currentOption.votes > highestVoteOption.votes
          ? currentOption
          : highestVoteOption,
      poll.options[0]
    );
    const response: AdminPollResponse = {
      id: poll._id!,
      name: poll.name,
      options: poll.options,
      totalVotes: poll.votes.length,
      voteResult: mostVotedOption.text,
    };
    return response;
  }

  private mapPollToUserResponse(
    poll: Poll,
    isAlreadyVote: boolean
  ): UserPollResponse {
    const response: UserPollResponse = {
      id: poll._id!,
      name: poll.name,
      options: poll.options.map((option) => option.text),
      isAlreadyVote: isAlreadyVote,
    };
    return response;
  }

  private isUserAlreadyVote(userId: string, votes: Votes[]): boolean {
    return votes.some((vote) => vote.voter.userId.toString() === userId);
  }
}
