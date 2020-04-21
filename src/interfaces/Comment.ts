export interface IComment {
  avatar?: string
  date?: Date
  nick?: string
  state?: number
  belong?: string
  targetNick?: string
  to?: string
  content?: string
  children?: IComment[]
}
