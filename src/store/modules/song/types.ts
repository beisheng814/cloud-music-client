export interface SongType {
  currentTime: number
  isPlay: boolean
  currentMode: string
  // 歌单id
  detailSongId: number
  // 当前播放歌曲id
  songId: number
  // 歌曲列表数组
  songIdArr: number[]
  // 歌单页面歌曲列表
  detailSongList: []
  // 请求获取的歌曲url列表
  songUrlList: []
  // 播放列表
  playList: []
  // 随机播放列表
  shuffledPlayList: []
  // 歌词数据
  lrcArr: { lrc: string; time: number }[]
}
