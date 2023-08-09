import { defineStore } from 'pinia'
import { UserType } from './types'
import { getLikeSongList } from '@/api/user'

const useUserStore = defineStore('user', {
  state: (): UserType => {
    return {
      userName: '',
      cookie: '',
      avatarUrl: '',
      isLogin: false,
      likeIdList: [],
      searchHistoryList: [],
      uid: 0
    }
  },
  persist: true,
  getters: {
    getUserName: state => state.userName,
    getCookie: state => state.cookie,
    getLikeIdList: state => state.likeIdList,
    getSearchHistoryList: state => state.searchHistoryList,
    getIsLogin: state => state.isLogin,
    getAvatarUrl: state => state.avatarUrl,
    getUid: state => state.uid
  },
  actions: {
    setIsLogin(isLogin: boolean) {
      this.isLogin = isLogin
    },
    setCookie(cookie: string) {
      this.cookie = cookie
    },
    setSearchHistoryList(searchHistoryList: string[]) {
      this.searchHistoryList = searchHistoryList
    },
    setLikeIdList(arr?: number[]) {
      if (arr) {
        this.likeIdList = arr
      } else {
        getLikeSongList(this.uid).then(res => {
          const { code, ids } = res
          if (code === 200) {
            this.likeIdList = ids
          }
        })
      }
    },
    setAvatarUrl(avatarUrl: string) {
      this.avatarUrl = avatarUrl
    },
    setUserName(userName: string) {
      this.userName = userName
    },
    setUid(uid: number) {
      this.uid = uid
    }
  }
})

export default useUserStore
