import { getDownloadUrl, getLikeSong } from '@/api/song'
import { useSongStore, useUserStore } from '@/store'
import { Message, TableData } from '@arco-design/web-vue'

const songStore = useSongStore()
const userStore = useUserStore()
export default function useSongTable(tableData: TableData) {
  const setRowClass = (record: TableData) => {
    // 正在播放的列样式
    return record.raw.id == songStore.getSongId ? 'play-row' : ''
  }
  // 下载音乐
  const downloadMusic = (id: number, name: string, ar: any) => {
    const artist = ar.map((item: any) => item.name).join(' / ')
    Message.warning('正在获取下载链接...')
    getDownloadUrl(id).then(res => {
      const {
        code,
        data: { type, url }
      } = res
      if (code === 200) {
        const fileName = `${name} - ${artist}.${type}`
        window.tools.downloadFile(url, fileName).then(() => {
          Message.success('下载成功')
        })
      } else {
        Message.error('下载失败')
      }
    })
  }
  // 喜欢音乐
  const likeSong = (id: number, like: boolean) => {
    const params = { id, like }
    getLikeSong(params).then(res => {
      const { code } = res
      if (code === 200) {
        if (like) {
          const arr = [id, ...userStore.getLikeIdList]
          userStore.setLikeIdList(arr)
          Message.success('喜欢成功')
        } else {
          const arr = [...userStore.getLikeIdList]
          const index = arr.indexOf(id)
          if (index !== -1) {
            arr.splice(index, 1)
          }
          userStore.setLikeIdList(arr)
          Message.success('取消成功')
        }
      } else {
        Message.error('操作失败')
      }
    })
  }
  // 双击列表项
  const cellDblclick = (record: TableData) => {
    // 将歌单全部歌曲替换到播放列表
    songStore.setDetailSongList(tableData.value)
    songStore.setPlayList(tableData.value)
    songStore.setSongId(record.id)
  }

  return {
    userStore,
    songStore,
    setRowClass,
    downloadMusic,
    likeSong,
    cellDblclick
  }
}
