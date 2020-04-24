import { findArticleByTagDao, findTagsDao } from '../dao/article.dao'
import { createTag } from '../dao/tags.dao'
import { validate, vli } from '../lib/validator'
import { formatRes } from '../lib/response'

const findArticleListByTag = async (ctx) => {
  let tagName = ctx.params.tagName
  let vr = vli([['isString', tagName]])
  ctx.body = vr.ok ? formatRes(await findArticleByTagDao(tagName), '查询失败') : vr
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
  let result = await findTagsDao()
  ctx.body = formatRes(result, `获取所有标签`)
}

export default {
  'GET /tags/:tagName': findArticleListByTag,
  'GET /getTags': getTags,

  'POST /admin/addTag': addTag,
}
