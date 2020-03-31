export const getTime = (separate?: string): string | (string | number)[] => {
  let { year, month, day, hours, millisecond, second } = createTime()
  if (<string>separate) {
    return [year, month, day].join(separate) + ' ' + [hours, millisecond, second].join(separate)
  }
  return [year, month, day, hours, millisecond, second]
}

export const getYmd = (): string => {
  let { year, month, day } = createTime()
  return [year, month, day].join(':')
}

export const getHms = (): string => {
  let { hours, millisecond, second } = createTime()
  return [hours, millisecond, second].join(':')
}

export const createTime = (_time?: Date, _zero = false) => {
  let time = localTime(_time)

  let [hours, millisecond, second] = time
    .toTimeString()
    .slice(0, 8)
    .split(':')

  let year = time.getFullYear(),
    month = time.getMonth() + 1,
    day = time.getDate()

  if (_zero) {
    year = appendZero(year)
    month = appendZero(month)
    day = appendZero(day)
    hours = appendZero(hours)
    millisecond = appendZero(millisecond)
    second = appendZero(second)
  }

  return {
    year,
    month,
    day,
    hours,
    millisecond,
    second
  }
}

export const appendZero = t => (Number(t) < 10 ? `0${t}` : t)

// 时间戳转时间
export const formatDuration = ms => {
  if (ms < 0) ms = -ms
  return {
    day: Math.floor(ms / 86400000),
    hour: Math.floor(ms / 3600000) % 24,
    minute: Math.floor(ms / 60000) % 60,
    second: Math.floor(ms / 1000) % 60,
    millisecond: Math.floor(ms) % 1000
  }
}

export const localTime = (time?: string | Date) => {
  let date = new Date(time)
  date = date.toString() === 'Invalid Date' ? new Date() : date
  let ymd = date.toLocaleDateString()
  let hms = date.toLocaleTimeString()
  if (hms.length > 8) {
    return new Date(ymd + ' ' + hms.slice(hms.length - 8))
  }
  return new Date(ymd + ' ' + hms)
}
