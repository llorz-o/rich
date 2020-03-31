import logs from '../lib/logs'

//  最新留言存入队列
export const saveCommentToQueueDao = message => {
  return Schema => {
    return new Promise(resolve => {
      Schema.create(message, (err, data) => {
        if (err) {
          logs.daoErr(`最新留言队列保存失败 Error:[${JSON.stringify(err)}]`)
          return resolve(false)
        }
        return resolve(true)
      })
    })
  }
}
// 删除CommentQueue 多余的
export const deleteCommentQueueDao = (num: number = 10) => {
  return Schema => {
    return new Promise(resolve => {
      Schema.findOne()
        .sort('date -1')
        .skip(num)
        .exec((err, data) => {
          if (err) {
            logs.daoErr('deleteCommentQueueDao 查询失败')
            resolve(false)
            return
          }
          if (data) {
            let _date = data.date
            Schema.deleteMany(
              {
                date: {
                  $lt: _date
                }
              },
              err => {
                if (err) {
                  logs.daoErr('deleteCommentQueueDao 删除失败')
                  resolve(false)
                  return
                }
                resolve(true)
              }
            )
          } else {
            resolve(true)
          }
        })
    })
  }
}

// 查询队列计数
export const findCommentQueueCountDao = () => {
  return (Schema): Promise<number> => {
    return new Promise(resolve => {
      Schema.find()
        .count()
        .exec((err, res) => {
          if (err) {
            logs.daoErr(`findCommentQueueCountDao 查询队列长度错误`)
            return resolve(0)
          }
          resolve(res)
        })
    })
  }
}
