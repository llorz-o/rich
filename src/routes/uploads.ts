import { vli } from '../lib/validator'
import { formatRes } from '../lib/response'
import { findSourceByType } from '../dao/upload.dao'

const getSource = async (ctx) => {
  let { fileType } = ctx.request.query
  let vr = vli([['isString', fileType]])
  ctx.body = vr.ok ? formatRes(await findSourceByType(fileType), '查询资源失败') : vr
}

export default {
  'GET /admin/getSource': getSource,
}
