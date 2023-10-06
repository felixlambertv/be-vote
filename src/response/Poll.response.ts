import { VoteOptions } from "../model/Poll.model";

export interface UserPollResponse {
  id: string;
  name: string;
  options: string[];
  isAlreadyVote: boolean;
}

export interface AdminPollResponse {
  id: string;
  name: string;
  options: VoteOptions[];
  totalVotes: number;
  voteResult: string | null;
}
