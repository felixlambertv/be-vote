export interface CreatePollRequest {
  name: string;
  options: string[];
}

export interface AddPollVoteRequest {
  optionIdx: number;
  name: string;
}
