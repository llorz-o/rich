import { sortArticleDao, findTagsDao } from '../dao/article.dao'
import { findNewsCommentsDao } from '../dao/comment.dao'
import { findNewMessages } from '../dao/message.dao'
const Home = async (ctx) => {
  // 查询最新文章 前 10 个
  let articles = await sortArticleDao()
  ctx.body = articles
}

const Init = async (ctx) => {
  //   查询首页需要显示的 tags 标签以及数量
  let tags = await findTagsDao()
  let newsMessage = await findNewMessages(10)

  ctx.body = {
    tags,
    newsMessage,
  }
}

export default {
  'GET /home': Home,
  'GET /init': Init,
}
