import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderType: { type: String, enum: ["user", "doctor"], required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    docId: { type: String, required: true, index: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    messages: [messageSchema],
    lastMessage: { type: String, default: "" },
  },
  { timestamps: true }
);

chatSchema.index({ userId: 1, docId: 1 }, { unique: true });

const chatModel = mongoose.models.chats || mongoose.model("chats", chatSchema);

export default chatModel;
