import { Document, Schema, Model, model } from 'mongoose'
import { ITags } from '../interfaces/Tags'

export interface TagsModel extends ITags, Document {}

export const TagsSchema: Schema = new Schema({
  tagName: {
    type: String,
    required: true,
    unique: true,
  },
})

export const Tags: Model<TagsModel> = model<TagsModel>('tags', TagsSchema)
