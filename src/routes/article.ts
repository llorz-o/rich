import { Mid } from '../lib/mongoose.verify'
import {
  getArticleDetialDao,
  sendArticleDao,
  sendCommentDao,
  addNewArticle,
  findArticleList,
  findTagsDao,
  updateArticleState,
  deleteArticleByIdDao,
} from '../dao/article.dao'
import { deleteCategoriesArticle, findCategories } from '../dao/categories.dao'
import { formatRes } from '../lib/response'
import validate = require('validate.js')
import { vli } from '../lib/validator'

/**
 * @description 获取文章
 * @param ctx
 */
const getArticle = async (ctx) => {
  let id = ctx.params.id
  if (id === undefined || !Mid(id)) {
    ctx.status = 404
    ctx.body = 'id 错误'
  } else {
    let data = await getArticleDetialDao(id)
    ctx.body = data
  }
}

/**
 * @description 文章留言
 * @param ctx
 */
const postArticleComment = async (ctx) => {
  let { isMaster, message } = ctx.request.body

  let data

  if (isMaster) {
    // 目标是楼主直接回复帖子
    data = await sendArticleDao(message)
  } else {
    data = await sendCommentDao(message, message.to)
  }

  ctx.body = {
    ok: !!data,
    data,
  }
}
// 添加文章
const postAddArticle = async (ctx) => {
  let article = ctx.request.body
  let vr = vli([['isObject', article]])
  ctx.body = vr.ok ? formatRes(await addNewArticle(article), '文章添加失败') : vr
}
// 删除文章中的分类
const deleteArticleCategories = async (ctx) => {
  let { articleId, categoriesId } = ctx.request.body
  let data = await deleteCategoriesArticle(categoriesId, articleId)
  ctx.body = {
    ok: data,
  }
}

// 获取文章列表
const getArticleList = async (ctx) => {
  let { skip, limit } = ctx.params
  skip = Number(skip)
  limit = Number(limit)
  let data
  if (validate.isNumber(skip) && validate.isNumber(limit)) {
    data = await findArticleList(skip, limit, ctx.request.query || {})
  }
  ctx.body = formatRes(data, '文章列表获取失败')
}

// 获取分类list 和 taglist
const getCategoriesAndTags = async (ctx) => {
  let tags = await findTagsDao()
  let categories = await findCategories()
  ctx.body = {
    ok: true,
    data: {
      tags,
      categories,
    },
  }
}

// 改变文章状态
const changeArticleState = async (ctx) => {
  let result,
    message = '请检查参数'
  let { articleId, state } = ctx.request.body
  if (validate.isNumber(state) && Mid(articleId)) {
    result = await updateArticleState(articleId, Number(state))
    message = '状态改变失败'
  }
  ctx.body = formatRes(result, message)
}

// 删除文章
const deleteArticleById = async (ctx) => {
  let { articleIds } = ctx.request.body
  let vr = vli([
    ['isArray', articleIds],
    ['isMid', (fn) => articleIds.every((id) => fn(id))],
  ])
  ctx.body = vr.ok ? formatRes(await deleteArticleByIdDao(articleIds), '删除文章失败') : vr
}

export default {
  'GET /article/:id': getArticle,
  'POST /articleComment': postArticleComment,
  'POST /deleteCategories': deleteArticleCategories,

  'GET /admin/getArticleList/:skip/:limit': getArticleList,
  'GET /admin/getCategoriesAndTags': getCategoriesAndTags,
  'POST /admin/changeArticleState': changeArticleState,
  'POST /admin/deleteArticle': deleteArticleById,
  'POST /admin/addArticle': postAddArticle,
}
