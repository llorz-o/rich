import { IMessage } from '../interfaces/Message'
import { Message } from '../models/messages'
import logs from '../lib/logs'

export const saveMessage = (message: IMessage) => {
  return new Promise((resolve) => {
    Message.create(message, (err, msg) => {
      if (err) {
        logs.daoErr(`saveMessage 保存留言失败 message:[${JSON.stringify(message)}] err:[${JSON.stringify(err)}]`)
        return resolve()
      }
      resolve(msg)
    })
  })
}

export const findMessageList = (limit: number, skip: number): Promise<Array<any>> =>
  new Promise((resolve) =>
    Message.find()
      .sort('-date')
      .skip(skip)
      .limit(limit)
      .exec((err, data) => {
        if (err) {
          logs.daoErr(`findMessageList 查询留言列表失败 limit:[${limit}] skip:[${skip}] err:[${JSON.stringify(err)}]`)
          return resolve([])
        }
        resolve(data)
      })
  )

export const findNewMessages = (len: number = 10) =>
  new Promise((resolve) =>
    Message.find()
      .sort('-date')
      .limit(len)
      .exec((err, data) => {
        if (err) {
          logs.daoErr(`findNewMessages 查询最新留言失败 len:[${len}] err:[${JSON.stringify(err)}]`)
          return resolve([])
        }
        resolve(data)
      })
  )
