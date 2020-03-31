import { Count } from '../models/count'
import { ICount } from '../interfaces/Count'
import logs from '../lib/logs'

export const createCountDao = () => {
  return Count.create({
    commentQueueLength: 0
  })
}

export const loadCountDao = () => {
  return new Promise((resolve: (data: ICount[] | void) => void) => {
    Count.find((err, data) => {
      if (err) {
        console.log('err__', err)
        return resolve()
      }
      resolve(data)
    })
  })
}

export const addCountDao = (key: string, id: string, reduceFlag?: boolean) => {
  Count.findOneAndUpdate(
    {
      _id: id
    },
    {
      $inc: {
        [key]: reduceFlag ? -1 : 1
      }
    },
    err => {
      if (err) {
        logs.daoErr(`count 计数${reduceFlag ? '减少' : '增加'}失败 id:[${id}] key:[${key}]`)
      }
    }
  )
}

export const reduceCountDao = (key: string, id: string) => {
  addCountDao(key, id, true)
}

export const resetCountDao = (key: string, id: string, reset: number) => {
  Count.findOneAndUpdate(
    {
      _id: id
    },
    {
      [key]: reset
    },
    err => {
      if (err) {
        logs.daoErr(`resetCountDao 重置失败`)
      }
    }
  )
}
