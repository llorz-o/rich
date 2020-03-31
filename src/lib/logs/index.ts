import * as fs from 'fs'
import * as path from 'path'

import ERROR_TYPE from './errorType'
import { getYmd, getTime } from '../../utils/timeFormat.util'
import fig from '../../config'

class Logs {
  private logsQueue: string[] = []
  private bufQueue: string[] = []
  private timer
  private logFileWriteStream
  private logFileIsClose: boolean = true
  public ErrorType
  constructor() {
    this.ErrorType = ERROR_TYPE
  }
  // route 层错误
  public routeErr(_err) {
    this.err(_err, ERROR_TYPE.RouteError)
  }
  // Dao 层错误
  public daoErr(_err) {
    this.err(_err, ERROR_TYPE.DaoError)
  }
  // System 错误,来源于node层api出现使用报错
  public sysErr(_err) {
    this.err(_err, ERROR_TYPE.SystemError)
  }
  // Type 错误
  public typeErr(_err) {
    this.err(_err, ERROR_TYPE.TypeError)
  }

  public err(_err, _err_type?: number) {
    // 先写入缓冲
    this.bufQueue.push(`[${ERROR_TYPE[_err_type]}]: ${getTime(':')} // ${_err}`)
    this.flushTimer()
  }
  // 1 秒写入一次,
  private flushTimer() {
    clearTimeout(this.timer)
    if (this.bufQueue.length > 100) {
      this.writeLogs()
    }
    this.timer = setTimeout(() => {
      clearTimeout(this.timer)
      // 写入
      this.writeLogs()
    }, 1000)
  }
  // 写入判断
  private writeLogs() {
    this.logsQueue = this.bufQueue
    this.bufQueue = []

    let today = getYmd()
        .split(':')
        .join('-'),
      file_path = path.join(fig.root, '/logs', `/${today}.log`),
      file_content = ''

    this.logsQueue.forEach(l => (file_content += l + '\r\n'))

    fs.access(file_path, fs.constants.F_OK | fs.constants.W_OK, err => {
      if (err) {
        // 文件不存在
        if (err.code === 'ENOENT') return this.initStream(file_path, file_content)
        // 文件不可写
        return console.error(`目标文件:[${file_path}]写入失败`)
      }
      if (!this.logFileWriteStream || this.logFileIsClose) this.initStream(file_path, file_content)
    })
  }
  // 使用 writeStream 流写入
  private initStream(_file_path, _file_content) {
    this.logFileWriteStream = fs.createReadStream(_file_path, {
      flags: 'r+'
    })
    this.logFileWriteStream.open = () => (this.logFileIsClose = false)
    this.logFileWriteStream.close = () => (this.logFileIsClose = true)
    this.logFileWriteStream.ready = () => (this.logFileIsClose = false)
    fs.writeFile(_file_path, _file_content, { flag: 'a' }, err => {
      if (err) console.error(`目标文件:[${_file_path}]写入失败`)
    })
  }
}

let logs: Logs = new Logs()

export default logs
