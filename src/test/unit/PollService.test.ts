import { Role } from "../../enum/Role";
import BaseException from "../../exception/BaseException";
import NotFoundException from "../../exception/NotFoundException";
import { IPollRepository } from "../../repositories/Poll.repository";
import { PollService } from "./../../services/Poll.service";
import { DatabaseException } from "../../exception/Database.exception";

describe("Poll Service test", () => {
  let pollService: PollService;
  let pollRepoMock: jest.Mocked<IPollRepository>;

  const mockPollData = {
    _id: "123",
    name: "mockPoll",
    options: [{ text: "option1", votes: 0 }],
    votes: [],
  };

  const userVoteData = {
    userId: "user1",
    name: "name",
    role: Role.USER,
  };

  const voteDetails = {
    optionIdx: 0,
    name: "pollName",
  };

  beforeEach(() => {
    pollRepoMock = {
      getAll: jest.fn(),
      findById: jest.fn(),
      createPoll: jest.fn(),
      createPollModel: jest.fn(),
      addVote: jest.fn(),
    };

    pollService = new PollService(pollRepoMock);
  });

  describe("addVote", () => {
    it("should successfully add vote", async () => {
      const updatedMockPoll = {
        ...mockPollData,
        votes: [
          {
            voter: { userId: "user1", name: "John" },
            optionIdx: 0,
            voteAt: new Date(),
          },
        ],
      };

      pollRepoMock.findById.mockResolvedValueOnce(mockPollData);
      pollRepoMock.addVote.mockResolvedValueOnce(updatedMockPoll);

      const result = await pollService.addVote(
        "123",
        userVoteData,
        voteDetails
      );
      expect(result.name).toBe("mockPoll");
      expect(result.isAlreadyVote).toBe(true);
    });

    it("should throw NotFoundException poll not found", async () => {
      pollRepoMock.findById.mockResolvedValueOnce(null);

      await expect(
        pollService.addVote("123", userVoteData, voteDetails)
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw BaseException when option is invalid", async () => {
      pollRepoMock.findById.mockResolvedValueOnce(mockPollData);

      await expect(
        pollService.addVote("123", userVoteData, {
          ...voteDetails,
          optionIdx: 10,
        })
      ).rejects.toThrow(new BaseException("Invalid option value"));
    });

    it("should throw BaseException when user already vote on poll", async () => {
      const pollWithVotes = {
        ...mockPollData,
        votes: [
          {
            voter: { userId: "user1", name: "John" },
            optionIdx: 0,
            voteAt: new Date(),
          },
        ],
      };

      pollRepoMock.findById.mockResolvedValueOnce(pollWithVotes);

      await expect(
        pollService.addVote("123", userVoteData, voteDetails)
      ).rejects.toThrow(new BaseException("User already voted"));
    });
  });

  describe("getPollList", () => {
    const mockPollList = [
      {
        _id: "123",
        name: "mockPoll1",
        options: [{ text: "option1", votes: 0 }],
        votes: [],
      },
      {
        _id: "124",
        name: "mockPoll2",
        options: [{ text: "option2", votes: 0 }],
        votes: [
          {
            voter: { userId: "user1", name: "John" },
            optionIdx: 0,
            voteAt: new Date(),
          },
        ],
      },
    ];

    it("should return a list of AdminPollResponse when user is admin role", async () => {
      const mockUser = { userId: "admin1", name: "Admin", role: Role.ADMIN };
      pollRepoMock.getAll.mockResolvedValueOnce(mockPollList);

      const result = await pollService.getPollList(mockUser);
      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("name");
      expect(result[0]).toHaveProperty("options");
      expect(result[0]).toHaveProperty("totalVotes");
      expect(result[0]).toHaveProperty("voteResult");
    });

    it("should return a list of AdminPollResponse when user is user role", async () => {
      const mockUser = { userId: "admin1", name: "Admin", role: Role.USER };
      pollRepoMock.getAll.mockResolvedValueOnce(mockPollList);

      const result = await pollService.getPollList(mockUser);
      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("name");
      expect(result[0]).toHaveProperty("options");
      expect(result[0]).toHaveProperty("isAlreadyVote");
    });
  });

  describe("createPoll", () => {
    it("should successfully create a poll", async () => {
      const createPollRequest = {
        name: "Test Poll",
        options: ["Option1", "Option2"],
      };

      const expectedPoll = {
        name: "Test Poll",
        options: [
          { text: "Option1", votes: 0 },
          { text: "Option2", votes: 0 },
        ],
        votes: [],
      };

      pollRepoMock.createPollModel.mockResolvedValueOnce(expectedPoll);

      const result = await pollService.createPoll(createPollRequest);
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("options");
      expect(result).toHaveProperty("totalVotes");
      expect(result).toHaveProperty("voteResult");
    });

    it("should throw a DatabaseException on error", async () => {
      const createPollRequest = {
        name: "Test Poll",
        options: ["Option1", "Option2"],
      };

      pollRepoMock.createPollModel.mockRejectedValueOnce(
        new Error("Database error")
      );

      await expect(pollService.createPoll(createPollRequest)).rejects.toThrow(
        DatabaseException
      );
    });
  });
});
