import { saveMessage, findMessageList } from '../dao/message.dao'
import { vli } from '../lib/validator'
import { formatRes } from '../lib/response'

const postMessage = async (ctx) => {
  let message = ctx.request.body
  let vr = vli([['isObject', message]])
  ctx.body = vr.ok ? formatRes(await saveMessage(message), '留言提交失败') : vr
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
