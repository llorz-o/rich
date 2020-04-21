import { saveMessage, findMessageList } from '../dao/message.dao'

const postMessage = async (ctx) => {
  let message = ctx.request.body
  let data = await saveMessage(message)
  if (data) {
    ctx.body = {
      ok: true,
      data,
    }
  } else {
    ctx.body = {
      ok: false,
      message: '留言提交失败',
    }
  }
}

const getMessageList = async (ctx) => {
  let { len, start } = ctx.params
  let data: Array<any> = await findMessageList(Number(len), Number(start))
  if (data) {
    ctx.body = {
      ok: true,
      data,
    }
  } else {
    ctx.body = {
      ok: false,
      message: '留言列表获取失败',
    }
  }
}

export default {
  'POST /message': postMessage,
  'GET /messageList/:len/:start': getMessageList,
}
