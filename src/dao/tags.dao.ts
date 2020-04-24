import { Tags } from '../models/tags'
import logs from '../lib/logs'

// export const findTags = () =>
//   new Promise((resolve) => {
//     Tags.find().exec((err, data) => {
//       if (err) {
//         logs.daoErr(`查询Tags 错误`)
//         return resolve([])
//       }
//       resolve(data)
//     })
//   })

export const createTag = (tagName: string) =>
  new Promise((resolve) => {
    Tags.create({ tagName }, (err, tag) => {
      if (err) {
        logs.daoErr(`createTag 创建标签失败 tagName:[${tagName}] err:[${JSON.stringify(err)}]`)
        return resolve()
      }
      return resolve(tag)
    })
  })
