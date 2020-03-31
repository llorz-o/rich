import { Article } from '../models/article'
import logs from '../lib/logs'

let test = async ctx => {
  ctx.body = 'test'
}

let queryArticle = async ctx => {
  let [err, data] = await new Promise(resolve => Article.find((...args) => resolve(args)))
  if (err) {
    ctx.body = []
    logs.daoErr('queryArticle 查询失败')
    return
  }
  ctx.body = data
}

export default {
  'GET /test': test,
  'GET /getArtivle': queryArticle
}
