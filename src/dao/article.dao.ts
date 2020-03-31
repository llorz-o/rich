import { Article } from '../models/article'
import { Tags } from '../models/tags'
import logs from '../lib/logs'
import { IMessage, IChildMessage } from '../interfaces/Article'
import { MessageQueue } from '../models/messageQueue'
// 查询排序文章,允许提供排序关键字与长度限制
export const sortArticleDao = ({ sortKey = 'date', sort = -1, limit = 10 } = {}) =>
  new Promise(resolve =>
    Article.find()
      .sort({
        [sortKey]: sort
      })
      .limit(limit)
      .exec((err, data) => {
        if (err) {
          logs.daoErr(`sortArticleDao sortKey:[${sortKey}] sort:[${sort}] limit:[${limit}]`)
          return resolve([])
        }
        resolve(data)
      })
  )

// 通过id获取文章详情
export const getArticleDetialDao = articleId =>
  new Promise(resolve =>
    Article.findByIdAndUpdate(articleId, { $inc: { viewCount: 1 } }, { new: true }, (err, data) => {
      if (err) {
        logs.daoErr(`getArticleDetialDao articleId:[${articleId}]`)
        return resolve('')
      }
      resolve(data)
    })
  )

// 回复文章
export const sendArticleDao = (articleId: string, message: IMessage) =>
  new Promise(resolve => {
    Article.findByIdAndUpdate(
      articleId,
      {
        $push: {
          messageList: message
        },
        $inc: {
          messageCount: 1
        }
      },
      {
        new: true
      },
      (err, data) => {
        if (err) {
          logs.daoErr(`sendArticleDao articleId:[${articleId}] message:[${JSON.stringify(message)}]`)
          return resolve()
        }
        resolve(data)
      }
    )
  })

// 回复留言
export const sendCommentDao = (articleId: string, message: IChildMessage, messageId: string) =>
  new Promise(resolve => {
    Article.update(
      { 'messageList._id': messageId },
      {
        $push: {
          'messageList.$.children': message
        },
        $inc: {
          messageCount: 1
        }
      },
      (err, data) => {
        if (err) {
          logs.daoErr(`sendCommentDao articleId:[${articleId}] messageId:[${messageId}] message:[${JSON.stringify(message)}] 插入子留言错误`)
          return resolve()
        }
        if (data.nModified > 0) {
          Article.findById(articleId, (err, data) => {
            if (err) {
              logs.daoErr(`sendCommentDao articleId:[${articleId}] messageId:[${messageId}] message:[${JSON.stringify(message)}] 查询文章错误`)
              return resolve()
            }
            resolve(data)
          })
        } else {
          logs.daoErr(`sendCommentDao articleId:[${articleId}] messageId:[${messageId}] message:[${JSON.stringify(message)}] 插入子留言失败`)
          return resolve()
        }
      }
    )
  })

// 通过标签查询文章列表
export const findArticleByTagDao = (tagName?: string) =>
  new Promise(resolve => {
    Tags.findOne({ tagName })
      .populate({
        path: 'tagList',
        select: '-content -messageList -lastChangeDate',
        options: {
          sort: '-date'
        }
      })
      .exec((err, data) => {
        if (err) {
          logs.daoErr(`tagName:[${tagName || '?'}] 标签查询文章失败`)
          return resolve([])
        }
        resolve(data)
      })
  })
