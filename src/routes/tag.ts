import { findArticleByTagDao } from '../dao/article.dao'

const findArticleListByTag = async ctx => {
  let tagName = ctx.params.tagName
  let tagsArticleList = await findArticleByTagDao(tagName)
  ctx.body = tagsArticleList
}

export default {
  'GET /tags/:tagName': findArticleListByTag
}
