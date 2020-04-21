import { Document, Schema, Model, model } from 'mongoose'
import { IArticle } from '../interfaces/Article'
import { localTime } from '../utils/timeFormat.util'

export interface ArticleModel extends IArticle, Document {}

export const ArticleSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    auth: {
      type: String,
      required: true,
    },
    cover: String,
    date: {
      type: Date,
      default: localTime,
    },
    desc: String,
    lastChangeDate: {
      type: Date,
      default: localTime,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    messageCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      required: true,
    },
    state: {
      type: Number,
      default: 0,
    },
    tags: [String],
    categorys: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
    },
    messageList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'comments',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
  }
)

ArticleSchema.virtual('tagList', {
  ref: 'tags',
  localField: 'tags',
  foreignField: 'tagName',
})

export const Article: Model<ArticleModel> = model<ArticleModel>('articles', ArticleSchema)
