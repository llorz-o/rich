import { Types } from 'mongoose'

export const Mid = (id: string) => {
  if (<string>id) {
    try {
      return Types.ObjectId.isValid(id)
    } catch (e) {
      return false
    }
  } else {
    return false
  }
}
