import validate = require('validate.js')

export function formatRes(data: any, message: string | any, dataKey: string = 'data') {
  if (data !== undefined && data !== null) {
    return {
      [dataKey]: data,
      ok: true,
    }
  } else {
    return {
      ok: false,
      message,
    }
  }
}
