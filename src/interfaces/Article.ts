export interface IChildMessage {
  avatar?: string
  date?: Date
  nick?: string
  state?: number
  to?: string
  content?: string
}

export interface IMessage {
  avatar?: string
  nick?: string
  content?: string
  date?: Date
  state?: number
  isMaster?: boolean
  children?: IChildMessage[]
}

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
  messageList?: IMessage[]
}
