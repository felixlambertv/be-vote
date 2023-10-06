import { Schema } from "mongoose";

export const PollSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  options: [
    {
      _id: false,
      text: { type: String, required: true },
      votes: { type: Number, default: 0 },
    },
  ],
  votes: [
    {
      _id: false,
      optionIdx: { type: Number, requried: true },
      voter: {
        _id: false,
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
      },
      votedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});
