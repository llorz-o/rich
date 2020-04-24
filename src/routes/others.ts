import validate = require('validate.js')
import { writeUploads } from '../lib/upload'

const crypto = require('crypto-js')
const QQ_NUMBER_REG = /([0-9]+)@qq/i

const getAvatar = async (ctx) => {
  let { email, s = 45 } = ctx.query
  console.log(ctx.query)
  if (email && <string>email) {
    let [match, p1] = email.match(QQ_NUMBER_REG) || []

    if (match && p1) {
      // qq 头像
      ctx.body = {
        ok: true,
        data: `http://q4.qlogo.cn/g?b=qq&nk=${p1}&s=3`,
      }
    } else {
      // gavatar 头像
      let email_md5 = crypto.MD5(email.toLowerCase()),
        avatar_url = `https://www.gravatar.com/avatar/${email_md5}?s=${s}&d=robohash`
      ctx.body = {
        ok: true,
        data: avatar_url,
      }
      // https://api.adorable.io/avatars/140/1751777388@qq.com.png
    }
  } else {
    ctx.body = {
      ok: false,
      message: '请确保email传入',
    }
  }
}

const upload = async (ctx) => {
  let files = ctx.request.files
  if (files && files.file) {
    if (validate.isArray(files.file)) ctx.body = await writeUploads(files.file)
    else ctx.body = await writeUploads([files.file])
  } else {
    ctx.response.status = 300
    ctx.body = {
      ok: false,
      message: '无法接收文件,请确认api',
    }
  }
}

export default {
  'GET /avatar': getAvatar,

  'POST /admin/upload': upload,
}
