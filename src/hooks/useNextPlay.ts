import { computed } from 'vue'
import { useSongStore } from '@/store'
import { cloneDeep } from 'lodash'

const songStore = useSongStore()

// 设置到当前播放或者下一首播放
export default function useNextPlay(songInfo: any, type: 'current' | 'next' = 'current', songInfoArr: any[] = []) {
  const index = computed(() => songStore.getCurrentIndex)
  const playList = computed(() => songStore.getPlayList)
  const arr = cloneDeep(playList.value) as any[]
  // 在数组的第index项后面添加
  if (songInfoArr.length === 0) {
    // 如果arr中某一项的id等于songInfo的id 则删除之前arr里的id相同的一项 将所有在其后面的下标向前移动
    const findIndex = arr.findIndex((item: any) => item.id === songInfo.id)
    if (findIndex !== -1) {
      // 将arr的第findIndex项删除
      arr.splice(findIndex, 1)
      // 当前播放的在相同的那个后面则直接添加index位置上
      if (index.value >= findIndex) {
        arr.splice(index.value, 0, songInfo)
      } else {
        arr.splice(index.value + 1, 0, songInfo)
      }
    } else {
      arr.splice(index.value + 1, 0, songInfo)
    }
  } else {
    let num = 0 // 记录删除在当前播放项前面的个数
    songInfoArr.forEach((x: any) => {
      const findIndex = arr.findIndex((item: any) => item.id === x.id)
      if (findIndex !== -1) {
        // 将arr的第findIndex项删除
        arr.splice(findIndex, 1)
        // 记录删除在当前播放项前面的个数
        if (index.value >= findIndex) {
          num += 1
        }
      }
    })
    arr.splice(index.value + 1 - num, 0, ...songInfoArr)
  }
  songStore.setPlayList(arr)
  // 当前播放直接设置播放id即可
  if (type === 'current') {
    songStore.setSongId(songInfo.id)
  }
  return {}
}
