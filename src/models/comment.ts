import { Document, Schema, Model, model } from 'mongoose'
import { IComment } from '../interfaces/Comment'
import { localTime } from '../utils/timeFormat.util'

export interface CommentModel extends IComment, Document {}

export const CommentSchema: Schema = new Schema({
  avatar: String,
  date: {
    type: Date,
    default: localTime,
  },
  nick: {
    type: String,
    required: true,
  },
  state: {
    type: Number,
    required: true,
  },
  targetNick: String,
  to: {
    // 回复的对象 id
    type: String,
    required: true,
  },
  belong: {
    // 所属文章 id
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: 'comments',
    },
  ],
})

export const Comment: Model<CommentModel> = model<CommentModel>('comments', CommentSchema)
