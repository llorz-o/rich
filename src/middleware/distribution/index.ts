import * as KoaRouter from 'koa-router'
import * as path from 'path'
import fig from '../../config'
import { readDir } from '../../utils/readFile.util'
import logs from '../../lib/logs'
import ERROR_TYPE from '../../lib/logs/errorType'

// R 是 koa-router 的回调函数
type R = {
  [api: string]: (ctx?: any, next?: any) => void
}

const router = new KoaRouter()

const distribution = (_routers_path?: string) => {
  let _reset_path: string

  if (<string>_routers_path) {
    _reset_path = path.join(fig.root, _routers_path)
  } else {
    _reset_path = path.join(fig.root, './routes')
  }

  readDir(_reset_path, async _filename => {
    let import_files = await import(path.join(fig.root, '/routes', _filename))
    if (!(import_files.default as object)) {
      logs.typeErr(`当前文件:[${_filename}]不是一个路由文件`)
    }
    let mappings: R = import_files.default
    for (let item in mappings) {
      let get_url_path: string = ''

      if (item.startsWith('GET')) {
        get_url_path = item.substring(4)
        router.get(get_url_path, mappings[item])
      } else if (item.startsWith('POST')) {
        get_url_path = item.substring(5)
        router.post(get_url_path, mappings[item])
      } else {
        logs.routeErr(`没有找到当前url[${item}]`)
        return
      }
    }
  })

  return router.routes()
}

export default distribution
