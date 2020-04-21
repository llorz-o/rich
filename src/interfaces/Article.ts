export interface IArticle {
  title?: string // 文章标题
  auth?: string // 文章作者
  date?: Date // 文章发布时间
  desc?: string // 文章描述信息
  lastChangeDate?: Date // 最后一次修改
  likeCount?: number
  messageCount?: number
  viewCount?: number
  content?: string
  tags?: string[]
  categorys?: string[]
  messageList?: string[]
  state: number
  cover?: string
}
