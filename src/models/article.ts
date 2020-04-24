import { Document, Schema, Model, model } from 'mongoose'
import { IArticle } from '../interfaces/Article'
import { localTime } from '../utils/timeFormat.util'

export interface ArticleModel extends IArticle, Document {}

export const ArticleSchema: Schema = new Schema(
  {
    // 标题
    title: {
      type: String,
      required: true,
    },
    // 作者
    auth: {
      type: String,
      required: true,
    },
    //封面主题
    coverTheme: {
      type: String,
      required: true,
    },
    // 摘要
    desc: String,
    // 封面样式
    style: {
      // 封面图片
      coverUrl: String,
      // 封面图片样式
      coverSty: String,
      // 封面全局样式
      coverDft: String,
    },
    // 发布时间
    date: {
      type: Date,
      default: localTime,
    },
    // 最后一次修改
    lastChangeDate: {
      type: Date,
      default: localTime,
    },
    // 点赞
    likeCount: {
      type: Number,
      default: 0,
    },
    // 留言
    messageCount: {
      type: Number,
      default: 0,
    },
    // 阅读
    viewCount: {
      type: Number,
      default: 0,
    },
    // 正文
    content: {
      type: String,
      required: true,
    },
    // 状态
    state: {
      type: Number,
      default: 0,
    },
    // 标签
    tags: {
      type: [String],
      default: ['空标签'],
    },
    // 分类
    categorys: String,
    // 留言列表
    messageList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'comments',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
  }
)

// ArticleSchema.virtual('tagList', {
//   ref: 'tags',
//   localField: 'tags',
//   foreignField: 'tagName',
// })

// ArticleSchema.virtual('categoryList', {
//   ref: 'categories ',
//   localField: 'categorys',
//   foreignField: 'name',
// })

export const Article: Model<ArticleModel> = model<ArticleModel>('articles', ArticleSchema)
