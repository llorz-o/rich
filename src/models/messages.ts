import { IMessage } from '../interfaces/Message'
import { Document, Schema, Model, model } from 'mongoose'
import { localTime } from '../utils/timeFormat.util'

export interface MessageModel extends IMessage, Document {}

export const MessageSchema: Schema = new Schema({
  avatar: {
    type: String,
    required: true,
  },
  nick: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
  state: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: localTime,
  },
})

export const Message: Model<MessageModel> = model<MessageModel>('messages', MessageSchema)
