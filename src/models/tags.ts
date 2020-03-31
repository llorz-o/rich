import { Document, Schema, Model, model } from 'mongoose'
import { ITags } from '../interfaces/Tags'
import { ChildSchema } from './article'

export interface TagsModel extends ITags, Document {}

export const TagsSchema: Schema = new Schema({
  tagName: {
    type: String,
    required: true
  },
  tagCount: Number,
  tagList: [
    {
      type: Schema.Types.ObjectId,
      ref: 'articles'
    }
  ]
})

ChildSchema.pre('save', next => {
  if (!this.tagCount) {
    this.tagCount = 1
  }
  next()
})

export const Tags: Model<TagsModel> = model<TagsModel>('tags', TagsSchema)
