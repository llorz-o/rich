import * as Koa from 'koa'
import * as KoaStatic from 'koa-static'
import * as KoaJson from 'koa-json'
import * as Koa2Cors from 'koa2-cors'
import * as KoaBody from 'koa-body'
import * as path from 'path'
import Distribution from './middleware/distribution'
import Units from './tests'
import fig from './config'
import db from './bootstrap/mongo'

db.once('open', () => {
  console.log('mongo is open')

  const koa = new Koa()

  const STATIC_PATH = './static'

  koa.use(
    KoaStatic(path.join(fig.root, STATIC_PATH), {
      maxage: 86400000,
    })
  )
  koa.use(
    Koa2Cors({
      origin: (ctx) => {
        return '*'
      },
      exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
      maxAge: 5,
      credentials: true,
      allowMethods: ['GET', 'POST', 'DELETE'],
      allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    })
  )
  koa.use(KoaBody())
  koa.use(KoaJson())
  koa.use(Distribution())
  koa.use(async (ctx) => {})
  koa.listen(3100)

  Units(['utils', 'logs', 'mongo'])
})
