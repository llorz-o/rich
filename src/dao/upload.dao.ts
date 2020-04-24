import { IUpload } from '../interfaces/Upload'
import { Upload } from '../models/upload'
import logs from '../lib/logs'

export const addUpload = (upload: IUpload) => {
  return new Promise((resolve) => {
    Upload.create(upload, (err, data) => {
      if (err) {
        logs.daoErr(`addUpload 添加上传数据失败 upload:[${JSON.stringify(upload)}] err:[${JSON.stringify(err)}]`)
        return resolve()
      }
      resolve(data)
    })
  })
}

export const findSourceByType = (type: string) => {
  return new Promise((resolve) => {
    Upload.find({
      fileType: type,
    }).exec((err, data) => {
      if (err) {
        logs.daoErr(`findSourceByType 获取资源地址失败 type:[${type}] err:[${JSON.stringify(err)}]`)
        return resolve()
      }
      resolve(data)
    })
  })
}
