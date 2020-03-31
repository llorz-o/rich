import { Document, Schema, Model, model } from 'mongoose'
import { ICount } from '../interfaces/Count'
import { messageQueueSchema } from './messageQueue'

export interface CountModel extends Document, ICount {}

export const CountSchema: Schema = new Schema({
  commentQueueLength: {
    type: Number,
    default: 0
  }
})

export const Count: Model<CountModel> = model<CountModel>('count', CountSchema)
