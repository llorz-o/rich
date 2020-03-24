import * as Koa from 'koa'
import * as KoaRouter from 'koa-router'

const koa = new Koa()
const router = new KoaRouter()

router.get('/', async ctx => {
  ctx.body = 'hello world!!'
})

koa.use(router.routes())
koa.listen(3000)
