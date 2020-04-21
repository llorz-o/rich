import { ICategories } from '../interfaces/Categories'
import { Document, Schema, Model, model } from 'mongoose'

export interface CategoriesModel extends ICategories, Document {}

export const CategoriesSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  list: [
    {
      type: Schema.Types.ObjectId,
      ref: 'articles',
    },
  ],
})

export const Categories: Model<CategoriesModel> = model<CategoriesModel>('categories', CategoriesSchema)
