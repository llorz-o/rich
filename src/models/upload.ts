import { IUpload } from '../interfaces/Upload'
import { Document, Schema, Model, model } from 'mongoose'
import { localTime } from '../utils/timeFormat.util'

export interface UploadModel extends IUpload, Document {}

export const UploadSchema: Schema = new Schema({
  mtime: {
    type: Date,
    default: localTime,
  },
  fileName: {
    type: String,
    required: true,
  },
  localName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  fileExt: {
    type: String,
    required: true,
  },
})

export const Upload: Model<UploadModel> = model<UploadModel>('uploads', UploadSchema)
