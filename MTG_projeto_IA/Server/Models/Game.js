import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  roomId: String,
  state: Object,
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Game", gameSchema);