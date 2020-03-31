import { Document, Schema, Model, model } from 'mongoose'
import { IArticle, IMessage, IChildMessage } from '../interfaces/Article'
import { localTime } from '../utils/timeFormat.util'

export interface ArticleModel extends IArticle, Document {}
export interface MessageModel extends IMessage, Document {}
export interface ChildMessageModel extends IChildMessage, Document {}

export const ChildSchema: Schema = new Schema({
  avatar: String,
  date: {
    type: Date,
    default: localTime
  },
  nick: {
    type: String,
    required: true
  },
  state: {
    type: Number,
    required: true
  },
  to: String,
  content: {
    type: String,
    required: true
  }
})

export const MessageSchema: Schema = new Schema({
  avatar: String,
  nick: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: localTime
  },
  state: {
    type: Number,
    required: true
  },
  isMaster: {
    type: Boolean,
    required: true
  },
  children: [ChildSchema]
})

export const ArticleSchema: Schema = new Schema({
  title: {
    type: String,
    required: true
  },
  auth: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: localTime
  },
  desc: String,
  lastChangeDate: {
    type: Date,
    default: localTime
  },
  likeCount: {
    type: Number,
    default: 0
  },
  messageCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  content: {
    type: String,
    required: true
  },
  tags: [String],
  categorys: String,
  messageList: [MessageSchema]
})

export const Article: Model<ArticleModel> = model<ArticleModel>('articles', ArticleSchema)
