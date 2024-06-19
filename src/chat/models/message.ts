import mongoose from "mongoose";
import { MESSAGE_TYPE } from "../../consts";

export interface IMessage {
  text: string;
  type: MESSAGE_TYPE;
  sender: mongoose.Types.ObjectId;
  chat: mongoose.Types.ObjectId;
  isRead: boolean;
}

export interface MessageModel extends IMessage, mongoose.Document {}

const chatSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: MESSAGE_TYPE.TEXT,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.model<MessageModel>("message", chatSchema);

export { messageModel };
