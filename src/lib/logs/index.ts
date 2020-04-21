import * as fs from 'fs'
import * as path from 'path'

import ERROR_TYPE from './errorType'
import { getYmd, getTime } from '../../utils/timeFormat.util'
import fig from '../../config'

class Logs {
  private logsQueue: string[] = []
  private bufQueue: string[] = []
  private timer
  private logFilePath
  private logFileIsPresence = false

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
  // 文件是否存在
  private judgeFileIsPresence() {
    let file_path = this.getFileName()
    fs.access(file_path, fs.constants.F_OK | fs.constants.W_OK, (err) => {
      if (err) {
        this.logFileIsPresence = false
        // 文件不存在
        // if (err.code === 'ENOENT') {
        //   this.logFileIsPresence = false
        // }
        // 文件不可写
        return console.error(`目标文件:[${file_path}]不可写`)
      }
      this.logFileIsPresence = true
    })
  }
  // 获取文件名
  private getFileName() {
    if (this.logFilePath === undefined) {
      let today = getYmd().split(':').join('-')
      this.logFilePath = path.join(fig.root, '/logs', `/${today}.log`)
    }
    return this.logFilePath
  }
  // 写入判断
  private writeLogs() {
    this.logsQueue = this.bufQueue
    this.bufQueue = []

    let file_path = this.getFileName(),
      file_content = ''

    this.logsQueue.forEach((l) => (file_content += l + '\r\n'))

    this.writeLogFile(file_path, file_content)
  }

  private writeLogFile(_file_path, _file_content) {
    fs.writeFile(_file_path, _file_content, { flag: 'a' }, (err) => {
      if (err) return console.error(`目标文件:[${_file_path}]写入失败`)
      this.logFileIsPresence = true
    })
  }
}

let logs: Logs = new Logs()

export default logs
