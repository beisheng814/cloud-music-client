import { defineStore } from 'pinia'
import { SongType } from './types'

const useSongStore = defineStore('song', {
  state: (): SongType => {
    return {
      currentTime: 0,
      isPlay: false,
      currentIndex: 0,
      currentMode: 'lb',
      // 歌单id
      detailSongId: 0,
      songId: 0,
      // 歌曲列表ID 数组
      songIdArr: [],
      // 歌单页面歌曲列表
      detailSongList: [],
      // 请求获取的歌曲url列表
      songUrlList: [],
      // 播放列表
      playList: [],
      // 随机播放列表
      shuffledPlayList: [],
      lrcArr: []
    }
  },
  persist: true,
  getters: {
    getCurrentTime: state => state.currentTime,
    getIsPlay: state => state.isPlay,
    getCurrentMode: state => state.currentMode,
    getCurrentIndex: state => state.currentIndex,
    getLrcArr: state => state.lrcArr,
    getDetailSongId: state => state.detailSongId,
    getSongId: state => state.songId,
    getSongIdArr: state => state.songIdArr,
    getDetailSongList: state => state.detailSongList,
    getSongUrlList: state => state.songUrlList,
    getPlayList: state => state.playList,
    getShuffledPlayList: state => state.shuffledPlayList
  },
  actions: {
    setIsPlay(isPlay: boolean) {
      this.isPlay = isPlay
    },
    setCurrentTime(currentTime: number) {
      this.currentTime = currentTime
    },
    setCurrentIndex(currentIndex: number) {
      this.currentIndex = currentIndex
    },
    setCurrentMode(currentMode: string) {
      this.currentMode = currentMode
    },
    setLrcArr(lrcArr: []) {
      this.lrcArr = lrcArr
    },
    setDetailSongId(detailSongId: number) {
      this.detailSongId = detailSongId
    },
    setSongId(songId: number) {
      this.songId = songId
    },
    setSongIdArr(songIdArr: number[]) {
      this.songIdArr = songIdArr
    },
    setDetailSongList(detailSongList: any) {
      this.detailSongList = detailSongList
    },
    setSongUrlList(songUrlList: any) {
      this.songUrlList = songUrlList
    },
    setPlayList(playList: any) {
      this.playList = playList
    },
    setShuffledPlayList(shuffledPlayList: any) {
      this.shuffledPlayList = shuffledPlayList
    }
  }
})

export default useSongStore
