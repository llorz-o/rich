import * as _validate from 'validate.js'
import { Mid } from './mongoose.verify'

interface validateRoleFn {
  (fn: Function): boolean
}

interface validateRole extends Array<any> {
  [0]: string // 使用的函数名
  [1]: validateRoleFn | any // 值
  [2]?: string // 值的名字
}

interface validateRoles extends Array<validateRole> {
  [key: number]: validateRole
}

export const validate = _validate

const validateMap = {
  isMid: Mid,
}

export const vli = (roles: validateRoles) => {
  let result = true,
    message
  roles.forEach((role) => {
    let [k, v, fname] = role
    const fn = validateMap[k] || validate[k]
    let validate_r = true
    if (!validate.isFunction(fn)) throw new Error(`k:[${k}] 不是一个合法的校验函数`)
    if (validate.isFunction(v)) {
      try {
        validate_r = v(fn)
      } catch (error) {
        console.warn(error)
        validate_r = false
      }
      if (!validate.isBoolean(validate_r)) throw new Error(`k:[${k}] 必须返回一个 Boolean 类型的值`)
    } else {
      try {
        validate_r = fn(v)
      } catch (error) {
        console.warn(error)
        validate_r = false
      }
    }
    if (validate_r === false) {
      // 校验失败
      message = message === undefined ? '参数不合法' : message
      message += ` | ${k}:${(typeof v).toLowerCase()} = [${v}]`
      result = false
    }
  })
  //   Object.keys(roles).forEach((k) => {
  //     const fn = validateMap[k] || validate[k]
  //     const v = roles[k]
  //     let validate_r = true
  //     if (!validate.isFunction(fn)) throw new Error(`k:[${k}] 不是一个合法的校验函数`)
  //     if (validate.isFunction(v)) {
  //       validate_r = v(fn)
  //       if (!validate.isBoolean(validate_r)) throw new Error(`k:[${k}] 必须返回一个 Boolean 类型的值`)
  //     } else {
  //       validate_r = fn(v)
  //     }
  //     if (validate_r === false) {
  //       // 校验失败
  //       message += ` | ${k}:${(typeof v).toLowerCase()} = [${v}]`
  //       result = false
  //     }
  //   })
  return {
    ok: result,
    message,
  }
}
