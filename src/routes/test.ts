import { Article } from '../models/article'
import logs from '../lib/logs'
import { vli } from '../lib/validator'

let test = async (ctx) => {
  // let articleAggregates = Article.aggregate([]).project('-messageList -content')
  // let untagsList = await articleAggregates.match({
  //   tags: {
  //     $size: 0,
  //   },
  // })
  // let tagsList = await Article.aggregate([])
  //   .project('-messageList -content')
  //   .unwind('tags')
  //   .group({
  //     _id: '$tags',
  //     tagsList: {
  //       $push: {
  //         _id: '$_id',
  //         title: '$title',
  //         desc: '$desc',
  //         likeCount: '$likeCount',
  //         messageCount: '$messageCount',
  //         viewCount: '$viewCount',
  //         state: '$state',
  //         auth: '$auth',
  //         categorys: '$categorys',
  //         date: '$date',
  //         cover: '$cover',
  //       },
  //     },
  //   })
  ctx.body = await Article.aggregate([]).project({
    messageList: 0,
    content: 0,
    test:{
      
    }
  })
}

let queryArticle = async (ctx) => {
  let [err, data] = await new Promise((resolve) => Article.find((...args) => resolve(args)))
  if (err) {
    ctx.body = []
    logs.daoErr('queryArticle 查询失败')
    return
  }
  ctx.body = data
}

export default {
  'GET /test': test,
  'GET /getArtivle': queryArticle,
}
