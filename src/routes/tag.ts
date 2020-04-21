import { findArticleByTagDao } from '../dao/article.dao'
import { createTag, findTags } from '../dao/tags.dao'
import { validate } from '../lib/validator'
import { formatRes } from '../lib/response'

const findArticleListByTag = async (ctx) => {
  let tagName = ctx.params.tagName
  let tagsArticleList = await findArticleByTagDao(tagName)
  ctx.body = tagsArticleList
}

const addTag = async (ctx) => {
  let { tagName } = ctx.request.body
  let result
  if (validate.isString(tagName)) {
    result = await createTag(tagName)
  }
  ctx.body = formatRes(result, `添加标签失败`)
}

const getTags = async (ctx) => {
  let result = await findTags()
  ctx.body = formatRes(result, `获取所有标签`)
}

export default {
  'GET /tags/:tagName': findArticleListByTag,
  'GET /getTags': getTags,

  'POST /admin/addTag': addTag,
}
