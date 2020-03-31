import { ICount } from '../interfaces/Count'
import { loadCountDao, addCountDao, reduceCountDao, createCountDao, resetCountDao } from '../dao/count.dao'
import logs from '../lib/logs'
import { deleteCommentQueueDao, findCommentQueueCountDao, saveCommentToQueueDao } from '../dao/commentQueue.dao'
import { MessageQueue } from '../models/messageQueue'

enum COUNT_MODEL_KEYS {
  commentQueueLength
}

const SchemaMap = {
  commentQueueLength: MessageQueue
}

class Reload {
  private _countModel
  public Keys
  constructor() {
    this.Keys = COUNT_MODEL_KEYS
  }

  public loadCountModel() {
    loadCountDao().then(data => {
      if (data && <ICount[]>data) {
        if (data.length == 0) {
          return createCountDao()
        }
        this._countModel = data[0]
      } else {
        console.error('_countModel 预加载失败,会产生预想不到的错误', data)
        logs.typeErr('_countModel 预加载失败')
        this._countModel = null
      }
    })
  }

  public async add(key: number, data) {
    if (<number>key || key == 0) {
      // 写入队列
      let saveFlag = await saveCommentToQueueDao(data)(SchemaMap[COUNT_MODEL_KEYS[key]])
      // 计数加 1
      if (saveFlag) await addCountDao(COUNT_MODEL_KEYS[key], this._countModel._id)
      // 判断长度
      this.clear(key)
    } else {
      logs.typeErr('add(key:number) 参数错误')
    }
  }
  // todo 需要修改,删除时队列中的数据也需要删除
  public async reduce(key: number) {
    if (<number>key || key == 0) {
      // 这里添加一个删除的方法,删除队列中的一个
      await reduceCountDao(COUNT_MODEL_KEYS[key], this._countModel._id)
      this.clear(key)
    } else {
      logs.typeErr('add(key:number) 参数错误')
    }
  }

  public async reset(key: number) {
    if (<number>key || key == 0) {
      let reset: number = await findCommentQueueCountDao()(SchemaMap[COUNT_MODEL_KEYS[key]])
      if (reset) {
        await resetCountDao(COUNT_MODEL_KEYS[key], this._countModel._id, reset)
      }
      this.loadCountModel()
    } else {
      logs.typeErr('reset(key:number) 参数错误')
    }
  }

  public async clear(key: number) {
    if (<number>key || key == 0) {
      //  删除定量数据
      if (this._countModel[COUNT_MODEL_KEYS[key]] > 100) {
        // 删除最旧的数据
        await deleteCommentQueueDao(70)(SchemaMap[COUNT_MODEL_KEYS[key]])
        this.reset(key)
      }
    } else {
      logs.typeErr('add(key:number) 参数错误')
    }
  }
}

let reload = new Reload()

export default reload
