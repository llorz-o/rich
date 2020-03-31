import utilsUnit from './utils.unit'
import logsUnit from './logs.unit'
import mongoUnit from './mongo.unit'

const testExample = {
  utils: utilsUnit,
  logs: logsUnit,
  mongo: mongoUnit
}
export default (openTestList: string[]) => {
  openTestList.forEach(k => testExample[k]())
}
