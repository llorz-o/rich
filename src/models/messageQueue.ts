import { Document, Schema, Model, model } from 'mongoose'
import { IMessageQueue } from '../interfaces/MessageQueue'
import { localTime } from '../utils/timeFormat.util'

export interface MessageQueueModel extends IMessageQueue, Document {}

export const messageQueueSchema: Schema = new Schema({
  avatar: String,
  nick: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  state: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: localTime
  },
  articleId: {
    type: String,
    required: true
  }
})

export const MessageQueue: Model<MessageQueueModel> = model<MessageQueueModel>('queue', messageQueueSchema)
