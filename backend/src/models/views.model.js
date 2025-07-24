import mongoose from "mongoose";

const viewSchema = new mongoose.Schema({
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  viewedAt: { type: Date, default: Date.now },
});

export const View = mongoose.model("View", viewSchema)
