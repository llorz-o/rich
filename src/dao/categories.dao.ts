import { Categories } from '../models/categories'
import logs from '../lib/logs'
import { ICategories } from '../interfaces/Categories'

export const findCategories = () =>
  new Promise((resolve) =>
    Categories.aggregate([
      {
        $project: {
          name: '$name',
          categoriesLen: {
            $size: '$list',
          },
        },
      },
    ]).exec((err, data) => {
      if (err) {
        logs.daoErr(`findCategories 查询分类失败 err:[${JSON.stringify(err)}]`)
        return resolve([])
      }
      resolve(data)
    })
  )

export const addCategories = (categories: ICategories) =>
  new Promise((resolve) =>
    Categories.create(categories, (err, cate) => {
      if (err) {
        logs.daoErr(`addCategories 添加分类失败 categories:[${JSON.stringify(categories)}] err:[${JSON.stringify(err)}]`)
        return resolve(false)
      }
      return resolve(cate)
    })
  )

// 添加文章至分类
export const addArticleToCategories = (cateId: any, id: any) =>
  new Promise((resolve) => {
    Categories.findByIdAndUpdate(
      cateId,
      {
        $push: {
          list: id,
        },
      },
      (err) => {
        if (err) {
          logs.daoErr(`addArticleToCategories 添加文章至分类 cateId:[${cateId}] id:[${id}] err:[${JSON.stringify(err)}]`)
          return resolve(false)
        }
        resolve(true)
      }
    )
  })

// 删除分类中的文章
export const deleteCategoriesArticle = (cateId: any, id: any) =>
  new Promise((resolve) => {
    Categories.findByIdAndUpdate(
      cateId,
      {
        $pull: {
          list: {
            $in: [id],
          },
        },
      },
      (err) => {
        if (err) {
          logs.daoErr(`deleteCategoriesArticle 删除分类中的文章 cateId:[${cateId}] id:[${id}] err:[${JSON.stringify(err)}]`)
          return resolve(false)
        }
        resolve(true)
      }
    )
  })
