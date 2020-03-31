import { sortArticleDao } from '../dao/article.dao'
import { findTags } from '../dao/tags.dao'

const Home = async ctx => {
  // 查询最新文章 前 10 个
  let articles = await sortArticleDao()
  ctx.body = articles
}

const Init = async ctx => {
  //   查询首页需要显示的 tags 标签以及数量
  let tags = await findTags()

  ctx.body = {
    tags
  }
}

export default {
  'GET /': Home,
  'GET /init': Init
}
