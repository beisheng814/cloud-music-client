//数值简写
export function numFormat(num: number): string {
  let result = ''
  if (typeof num === 'number') {
    if (num >= 100000000) {
      result = Math.round(num / 100000000) + '亿'
    } else if (num >= 10000) {
      result = Math.round(num / 10000) + '万'
    } else if (num >= 1000) {
      result = Math.round(num / 1000) + '千'
    } else {
      result = num.toString()
    }
  }

  return result
}

// 数组中随机获取numIndexes条数据
export function getRandomIndexes<T>(arr: T[], numIndexes: number): T[] {
  if (numIndexes > arr.length) {
    return arr
  }
  let randomItems: T[] = []
  // 创建一个包含所有可能下标的数组
  const allIndexes = Array.from({ length: arr.length }, (_, i) => i)

  // 洗牌算法，随机交换数组中的元素
  for (let i = arr.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    ;[allIndexes[i], allIndexes[randomIndex]] = [allIndexes[randomIndex], allIndexes[i]]
  }
  randomItems = allIndexes.slice(0, numIndexes).map(index => arr[index])
  // 返回前 numIndexes 个下标的值
  return randomItems
}

// 秒数转换格式
export function formatTime(seconds: number): string {
  const minutes: number = Math.floor(seconds / 60)
  const remainingSeconds: number = Math.round(seconds % 60)

  const formattedMinutes: string = minutes < 10 ? '0' + minutes : minutes.toString()
  const formattedSeconds: string = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds.toString()

  return formattedMinutes + ':' + formattedSeconds
}

// 将两个数组中每一项 id 相同的对象合并  顺序为array2的顺序
export interface Item {
  id: number
  [key: string]: any // 允许其他属性
}
export function mergeArraysById(array1: Item[], array2: Item[]): Item[] {
  const mergedById: { [id: number]: Item } = {}

  for (const item of array1) {
    mergedById[item.id] = { ...item }
  }

  const mergedArray: Item[] = []

  for (const item of array2) {
    if (mergedById[item.id]) {
      Object.assign(mergedById[item.id], item)
      mergedArray.push(mergedById[item.id])
    } else {
      mergedArray.push(item)
    }
  }

  return mergedArray
}

// 实现随机打乱数组的顺序 使用Fisher-Yates算法来随机打乱一个数组的顺序。这个算法通过遍历数组，从当前位置开始，随机选择一个位置并交换元素，直到遍历完整个数组
export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// 将时间戳转换为 2023-04-01 的格式
export function formatTimestampToDate(timestamp: number): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
export function formatStrTime(time: string) {
  if (time) {
    const [mm, ss] = time.split(':')
    const m = parseInt(mm) * 60
    const s = parseFloat(ss)
    return m + s
  }

  // const totalSeconds = m + s
  // return totalSeconds
}

// 设置歌词格式
export function formatLyric(lrc: string) {
  const arr = lrc.split('\n') as any
  arr.forEach((item: string, i: number) => {
    const a = item.split(']')
    const lrc = a[1]
    const t = a[0].split('[')[1]
    const time = formatStrTime(t)
    arr[i] = { time, lrc }
  })
  // 过滤空对象和歌词内容为空
  let newArray = arr.filter((item: any) => Object.keys(item).length > 0 && item.lrc !== undefined && item.lrc !== null && item.lrc !== '' && item.lrc !== ' ')
  return newArray
}

// 设置逐字歌词格式
export function formatFontLyric(lrc: string) {
  const data = lrc.split('\n').map((item: any) => {
    try {
      let obj = JSON.parse(item)
      let lrc = ''
      obj.c.forEach((item: any, i: number) => {
        lrc = lrc + item.tx
      })
      obj.lrc = lrc
      obj.cTime = 0
      return obj
    } catch (err) {
      if (item) {
        const timeArr = item.match(/\((.*?)\)/g).map((match: any) => {
          const [k, c] = match.slice(1, -1).split(',')
          return { k: parseInt(k), c: parseInt(c) }
        })
        const [t, cTime] = item
          .match(/\[(.*?)\]/)[1]
          .split(',')
          .map((num: any) => parseInt(num))

        let lrcArr = item.match(/\)(.*?)\(/g).map((match: any) => match.slice(1, -1))
        const lastStr = item.substring(item.lastIndexOf(')') + 1)
        lrcArr.push(lastStr)
        const tlrc = lrcArr
        const lrc = tlrc.join('')
        const fontArr = tlrc.map((item: any, i: number) => {
          return {
            k: timeArr[i].k || 0,
            c: timeArr[i].c || 0,
            l: item
          }
        })

        return { lrc, t, cTime, timeArr, fontArr }
      }
      return { cTime: 0 }
    }
  })
  return data
}

/**
 * 将时间戳转换为日期字符串
 * @param {number} time - 时间戳
 * @param {number} type - 格式类型,0为 'YYYY-MM-DD',1为 'YYYY年MM月DD日 HH:mm'
 * @returns {string} 格式化后的日期字符串
 */

export function formatDate(time: number, type = 0) {
  const date = new Date(time)

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  let hour: string | number = date.getHours()
  hour = hour < 10 ? '0' + hour : hour

  let minute: string | number = date.getMinutes()
  minute = minute < 10 ? '0' + minute : minute

  if (type === 0) {
    return `${year}-${month}-${day}`
  } else if (type === 1) {
    return `${year}年${month}月${day}日 ${hour}:${minute}`
  }
}
