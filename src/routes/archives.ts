import { findArchives } from '../dao/article.dao'

const getArchives = async (ctx) => {
  let data = await findArchives()
  if (data) {
    ctx.body = {
      ok: true,
      data: data,
      message: '',
    }
  } else {
    ctx.body = {
      ok: false,
      data: [],
      message: '归档查询失败',
    }
  }
}

export default {
  'GET /archives': getArchives,
}
