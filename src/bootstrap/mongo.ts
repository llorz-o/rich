import * as mongoose from 'mongoose'
import logs from '../lib/logs'

mongoose.connect('mongodb://admin:123456@127.0.0.1:27017', {
  dbName: 'rich'
})

const db = mongoose.connection

db.on('error', err => {
  logs.daoErr('mongodb 连接失败')
})

export default db
