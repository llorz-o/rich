import { Article } from '../models/article'
import logs from '../lib/logs'
import { vli } from '../lib/validator'

let test = async (ctx) => {
  // {
  //   isNumber: 12,
  //   isString: (fn) => fn('12'),
  //   isNumber: (fn) => [1, '2'].every((v) => fn(v)),
  // }
  ctx.body = vli([
    ['isNumber', (fn) => fn('af')],
    ['isMid', '12121'],
  ])
}

let queryArticle = async (ctx) => {
  let [err, data] = await new Promise((resolve) => Article.find((...args) => resolve(args)))
  if (err) {
    ctx.body = []
    logs.daoErr('queryArticle 查询失败')
    return
  }
  ctx.body = data
}

export default {
  'GET /test': test,
  'GET /getArtivle': queryArticle,
}
