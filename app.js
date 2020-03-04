const Path = require('path')

const Koa = require('koa');
const KoaCors = require('koa2-cors')
const KoaStatic = require('koa-static')
const KoaBodyparser = require('koa-bodyparser')
const KoaRouter = require('koa-router')

const StaticFile = require('./middleware/_staticfile')
const Controller = require('./middleware/_controller')

const app = new Koa();

const koaRouter = KoaRouter()

Controller(koaRouter, Path.resolve(__dirname, './controllers'))

app
    .use(async (ctx, next) => {
        await next();
        // console.log(`请求路径为 : ${ctx.request.url},请求方法为 : ${ctx.request.method}`)
    })
    .use(StaticFile('./resource/', __dirname + '/resource'))
    .use(KoaCors({
        origin: '*',
        exposeHeaders: [
            'WWW-Authenticate',
            'Server-Authorization',
        ],
        maxAge: 5,
        credentials: true,
        allowMethods: [
            'GET',
            'POST',
            'DELETE',
            'OPTIONS'
        ],
        allowHeaders: [
            'Content-Type',
            'Authorization',
            'Accept',
            'x-auth-token',
            'X-Requested-With'
        ],
    }))
    .use(KoaStatic(__dirname, 'public'))
    .use(KoaBodyparser())
    .use(koaRouter.routes())
    .use(async ctx => {
        ctx.body = 'Hello world'
    })

app.listen(3000);