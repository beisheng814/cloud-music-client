import { defineStore } from 'pinia'

const useFindStore = defineStore('find', {
  state: () => {
    return { 
      bannerList: [],
      resourceList: [],
    }
  },
  persist: true,
  getters: {
    getBannerList: (state) => state.bannerList,
    getResourceList: (state) => state.resourceList,
  },
  actions: {
    setBannerList(bannerList: any) {
      this.bannerList = bannerList
    },
    setResourceList(resourceList: any) {
      this.resourceList = resourceList
    },
  }
})

export default useFindStore
