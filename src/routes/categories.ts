import { findCategories, addCategories } from '../dao/categories.dao'

const getCategories = async (ctx) => {
  let data = await findCategories()
  if (data) {
    ctx.body = {
      ok: true,
      data,
    }
  } else {
    ctx.body = {
      ok: false,
      message: '查询分类失败',
    }
  }
}

const postAddCategories = async (ctx) => {
  let categories = ctx.request.body
  let data = await addCategories(categories)
  if (data) {
    ctx.body = {
      ok: true,
      data,
    }
  } else {
    ctx.body = {
      ok: false,
      message: '添加分类失败',
    }
  }
}

export default {
  'GET /categories': getCategories,
  'POST /admin/addCategories': postAddCategories,
}
