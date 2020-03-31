import { IMessage } from '../interfaces/Article'
import { sendCommentDao, sendArticleDao } from '../dao/article.dao'
import reload from '../bootstrap/reload'

export const sendComnentS = async (articleId: string, message: IMessage, messageId?: string) => {
  const writeCount = data => {
    // 每添加一个留言随即计数 +1
    if (data) {
      let { avatar, nick, state, content } = message
      // 是否成功写入
      reload.add(reload.Keys.commentQueueLength, {
        avatar,
        nick,
        state,
        content,
        articleId
      })
    }
  }
  if (messageId) {
    return sendCommentDao(articleId, message, messageId).then(data => {
      writeCount(data)
      return data
    })
  }
  return sendArticleDao(articleId, message).then(data => {
    writeCount(data)
    return data
  })
}
