import { Comment } from '../models/comment'
import logs from '../lib/logs'

// 查询最新的前 len 条留言
export function findNewsCommentsDao(len: number) {
  return new Promise((resolve) =>
    Comment.find()
      .sort('-date')
      .limit(len)
      .exec((err, data) => {
        if (err) {
          logs.daoErr(`findNewsCommentsDao:查询最新留言失败 err:${JSON.stringify(err)} len:[${len}]`)
          return resolve('')
        }
        return resolve(data)
      })
  )
}
