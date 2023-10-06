export interface VoteOptions {
  text: string;
  votes: number;
}

export interface UserVote {
  userId: string;
  name: string;
}

export interface Votes {
  optionIdx: number;
  voter: UserVote;
  voteAt: Date;
}

export interface Poll {
  _id?: string;
  name: string;
  options: VoteOptions[];
  votes: Votes[];
}
