import { Tags } from '../models/tags'
import logs from '../lib/logs'

export const findTags = () =>
  new Promise(resolve => {
    Tags.find().exec((err, data) => {
      if (err) {
        logs.daoErr(`查询Tags 错误`)
        return resolve([])
      }
      resolve(data)
    })
  })
