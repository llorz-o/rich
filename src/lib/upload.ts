import * as fs from 'fs'
import * as pt from 'path'
import * as crypto from 'crypto-js'
import validate = require('validate.js')
import { moment } from './export'
import fig from '../config'
import logs from './logs'
import { addUpload } from '../dao/upload.dao'

export const writeUploads = (files: any[]) => {
  return new Promise((resolve) => {
    if (validate.isArray(files)) {
      let result = []
      let uploads: any[] = []
      //   根据文件名生成 hash + mtime 形成文件名
      for (let index = 0; index < files.length; index++) {
        const file = files[index]
        const { size, path, name, type, mtime } = file
        const ext = name.split('.').pop()
        const fileType = (type.split('/').shift() || 'other') + 's'
        const fileName = crypto.MD5(name) + moment(mtime).format('YYYY-MM-DD') + '.' + ext
        const reader = fs.createReadStream(path)
        const fileDirPath = pt.join(fig.root, './static/', `${fileType}`)
        const filePath = pt.join(fileDirPath, `./${fileName}`)
        const urlPath = `./${fileType}/${fileName}`
        let upStream

        const judgetResolve = () => {
          if (index >= files.length - 1) {
            resolve({ ok: result.length === files.length ? false : true, result, uploads })
          }
        }

        const writeStream = () => {
          upStream = fs.createWriteStream(filePath, {
            emitClose: true,
          })
          upStream.on('error', (error) => {
            result.push({
              size,
              name,
              type,
              mtime,
              errorMessage: error || '未知错误',
            })
            logs.sysErr(`文件流写入失败 fileDirPath:[${fileDirPath}] fileType:[${fileType}] err:[${JSON.stringify(error)}]`)
            judgetResolve()
          })
          upStream.on('finish', async (res) => {
            uploads.push(
              await addUpload({
                mtime,
                fileName: name,
                localName: fileName,
                fileUrl: urlPath,
                fileType,
                fileSize: Number(size),
                fileExt: ext,
              })
            )
            judgetResolve()
          })
          reader.pipe(upStream)
        }

        reader.on('ready', (res) => {
          fs.stat(fileDirPath, (err, stats) => {
            if (err) {
              fs.mkdir(fileDirPath, (err) => {
                if (err) {
                  logs.sysErr(`fileDirPath:[${fileDirPath}] fileType:[${fileType}] err:[${JSON.stringify(err)}]`)
                  return resolve({ ok: false, message: err })
                }
                writeStream()
              })
            } else if (stats.isDirectory()) {
              writeStream()
            } else {
              logs.sysErr(`目标:[${fileDirPath}]存在且不是一个文件夹`)
              result.push({
                size,
                name,
                type,
                mtime,
                errorMessage: '系统错误',
              })
            }
          })
          console.log('ready --', res)
        })
      }
    } else {
      console.warn(`files 需要一个数组`)
      return resolve({
        ok: false,
      })
    }
  })
}
