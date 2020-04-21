import { Article } from '../models/article'
import { Tags } from '../models/tags'
import { IComment } from '../interfaces/Comment'
import logs from '../lib/logs'
import { Comment } from '../models/comment'
import { IArticle } from '../interfaces/Article'
import { addArticleToCategories } from './categories.dao'
import { moment } from '../lib/export'
// 查询排序文章,允许提供排序关键字与长度限制
export const sortArticleDao = ({ sortKey = 'date', sort = -1, limit = 10 } = {}) =>
  new Promise((resolve) =>
    Article.find()
      .sort({
        [sortKey]: sort,
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
export const getArticleDetialDao = (articleId: string) =>
  new Promise((resolve) => {
    Article.findByIdAndUpdate(articleId, { $inc: { viewCount: 1 } }, { new: true })
      .populate({
        options: {
          sort: '-date',
        },
        path: 'messageList',
        populate: {
          path: 'children',
        },
      })
      .exec((err, data) => {
        if (err) {
          logs.daoErr(`getArticleDetialDao 查询文章详情 _id:[${articleId}] 失败 err:[${JSON.stringify(err)}]`)
          return resolve(false)
        }
        return resolve(data)
      })
  })

export const articleInc = (id: any, k: string, $ins = 1) => {
  return new Promise((resolve) =>
    Article.findOneAndUpdate(
      id,
      {
        $inc: {
          [k]: $ins,
        },
      },
      (err) => {
        if (err) {
          logs.daoErr(`articleInc 计数堆加失败`)
          return resolve(true)
        }
        resolve(false)
      }
    )
  )
}

// 回复文章,需要在文章 list 列表添加留言 id
export const sendArticleDao = (message: IComment) =>
  new Promise((resolve) =>
    Comment.create(message, (err, msg) => {
      if (err) {
        logs.daoErr(`sendArticleDao message:[${JSON.stringify(message)}] err:[${JSON.stringify(err)}]`)
        return resolve(false)
      }
      Article.findByIdAndUpdate(
        message.belong,
        {
          $push: {
            messageList: msg._id,
          },
          $inc: {
            messageCount: 1,
          },
        },
        { new: true },
        (err) => {
          if (err) {
            logs.daoErr(`sendArticleDao 留言添加至文章 _id:[${msg._id}] 添加失败 err:[${JSON.stringify(err)}]`)
            return resolve()
          }
          return resolve(msg)
        }
      )
    })
  )

// 回复留言
export const sendCommentDao = (message: IComment, to: string) =>
  new Promise((resolve) =>
    Comment.create(message, (err, msg) => {
      if (err) {
        logs.daoErr(`sendCommentDao message:[${JSON.stringify(message)}] err:[${JSON.stringify(err)}]`)
        return resolve(false)
      }
      Comment.findByIdAndUpdate(
        to,
        {
          $push: {
            children: msg._id,
          },
        },
        { new: true },
        (err) => {
          if (err) {
            logs.daoErr(`sendCommentDao 留言添加至楼主 _id:[${msg._id}] 添加失败 err:[${JSON.stringify(err)}]`)
            return resolve()
          }
          articleInc(message.belong, 'messageCount')
          return resolve(msg)
        }
      )
    })
  )

// 通过标签查询文章列表
export const findArticleByTagDao = (tagName?: string) =>
  new Promise((resolve) => {
    Tags.findOne({ tagName })
      .populate({
        path: 'tagList',
        select: '-content -messageList -lastChangeDate',
        options: {
          sort: '-date',
        },
      })
      .exec((err, data) => {
        if (err) {
          logs.daoErr(`findArticleByTagDao 通过标签查询文章列表失败 tagName:[${tagName || '?'}] 标签查询文章失败`)
          return resolve([])
        }
        resolve(data)
      })
  })

// 查询文章归档
export const findArchives = () =>
  new Promise((resolve) =>
    Article.find()
      .sort('-date')
      .select('date title')
      .exec((err, data) => {
        if (err) {
          logs.daoErr(`findArchives 查询文章归档失败 err:[${JSON.stringify(err)}]`)
          return resolve()
        }
        return resolve(data)
      })
  )

// 添加新的文章
export const addNewArticle = (article: IArticle) => {
  return new Promise((resolve) => {
    Article.create(article, (err, _article) => {
      if (err) {
        logs.daoErr(`addNewArticle 文章添加失败 article:[${JSON.stringify(article)}] err:[${JSON.stringify(err)}]`)
        return resolve()
      }
      addArticleToCategories(_article.categorys, _article._id)
      return resolve(_article)
    })
  })
}

export interface filterArticleListQuery {
  title?: string
  start_date?: string | Date
  end_date?: string | Date
  categories?: string
  tag?: string
}
// 文章列表
export const findArticleList = (
  skip: number = 0,
  limit: number = 10,
  { title, start_date = new Date(0), end_date = new Date(2100, 0, 1), categories, tag }: filterArticleListQuery = {}
) =>
  new Promise((resolve) => {
    let categorys_match = {}
    if (categories)
      categorys_match = {
        name: categories,
      }

    let ArticleList = Article.find()
      .populate('tagList')
      .populate({
        path: 'categorys',
        select: 'name _id',
        match: categorys_match,
      })
      .select('-content -messageList')
      .skip(skip)
      .limit(limit)

    if (start_date || end_date) {
      start_date = moment(start_date).startOf('day').format()
      end_date = moment(end_date).endOf('day').format()
      console.log(start_date, end_date)
      ArticleList = ArticleList.where('date').gte(start_date).lte(end_date)
    }
    if (title) {
      ArticleList = ArticleList.where('title').regex(new RegExp(title, 'i'))
    }
    if (tag) {
      ArticleList = ArticleList.find({
        tags: tag,
      })
    }
    ArticleList.exec((err, articleList) => {
      if (err) {
        logs.daoErr(`findArticleList 查询文章列表失败 skip:[${skip}] limit:[${limit}] err:[${JSON.stringify(err)}]`)
        return resolve()
      }
      ArticleList.count((err, count) => {
        if (err) {
          return resolve({
            articleList,
            count: 0,
          })
        }
        resolve({ articleList, count })
      })
    })
  })

// 查询所有的tag
export const findTagsDao = (findArticleList: boolean = false) =>
  new Promise((resolve) => {
    let group: any = {
      _id: '$tags_doc._id',
      tagName: {
        $addToSet: '$tags_doc.tagName',
      },
      count: {
        $sum: 1,
      },
    }
    if (findArticleList) {
      group.articleList = {
        $push: {
          _id: '$_id',
          title: '$title',
          desc: '$desc',
          likeCount: '$likeCount',
          messageCount: '$messageCount',
          viewCount: '$viewCount',
          state: '$state',
          auth: '$auth',
          categorys: '$categorys',
          date: '$date',
          cover: '$cover',
        },
      }
    }
    resolve(
      Article.aggregate([
        {
          $lookup: {
            from: 'tags',
            localField: 'tags',
            foreignField: 'tagName',
            as: 'tags_doc',
          },
        },
      ])
        .unwind('tags_doc')
        .group(group)
        .unwind('tagName')
    )
  })

export const updateArticleState = (articleId: string, state: number) =>
  new Promise((resolve) => {
    Article.findByIdAndUpdate(
      articleId,
      {
        state: state,
      },
      (err) => {
        if (err) {
          logs.daoErr(`updateArticleState 更改文章状态失败`)
          resolve()
        }
        resolve(true)
      }
    )
  })

export const deleteArticleByIdDao = (articleIds: string[]) =>
  new Promise((resolve) => {
    Article.deleteMany(
      {
        _id: {
          $in: articleIds,
        },
      },
      (err) => {
        if (err) {
          logs.daoErr(`deleteArticleById 删除文章失败 articleIds:[${JSON.stringify(articleIds)}] err:[${JSON.stringify(err)}]`)
          resolve()
        }
        resolve(true)
      }
    )
  })
