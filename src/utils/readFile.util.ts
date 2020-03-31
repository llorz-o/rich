import * as fs from 'fs'
import logs from '../lib/logs'
import ERROR_TYPE from '../lib/logs/errorType'

export const readDir = (_dir: string, fn?: (_filename) => any) => {
  fs.readdir(_dir, (_err, _read_dirs) => {
    if (_err) {
      return logs.sysErr(_err)
    }
    _read_dirs.filter(_f => _f.endsWith('.ts')).forEach(_f => fn(_f))
  })
}
