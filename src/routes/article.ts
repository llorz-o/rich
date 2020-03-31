import { Article, MessageSchema } from '../models/article'
import { Mid } from '../lib/mongoose.verify'
import logs from '../lib/logs'
import { getArticleDetialDao, sendArticleDao, sendCommentDao } from '../dao/article.dao'
import { sendComnentS } from '../services/article.s'

/**
 * @description 获取文章
 * @param ctx
 */
const getArticle = async ctx => {
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
const postArticleComment = async ctx => {
  let { articleId, isMaster, messageId, nick, message } = ctx.request.body
  if (!articleId || !message) {
    ctx.status = 404
    return
  }
  if (!Mid(articleId)) {
    ctx.status = 404
    ctx.body = '文章 id 错误'
    return
  }

  let data

  if (isMaster) {
    // 目标不是楼主直接回复帖子
    message.isMaster = isMaster
    data = await sendComnentS(articleId, message)
  } else {
    if (!Mid(messageId)) {
      ctx.status = 404
      ctx.body = '留言 id 错误'
      return
    }

    message.to = nick
    data = await sendComnentS(articleId, message, messageId)
  }

  ctx.body = data
}

export default {
  'GET /article/:id': getArticle,
  'POST /articleComment': postArticleComment
}
