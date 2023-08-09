import { defineStore } from 'pinia'

const useAppStore = defineStore('app', {
  state: () => {
    return { 
      count: 0,
      name: ''
    }
  },
  persist: true,
  getters: {
    getCount: (state) => state.count,
    getName: (state) => state.name
  },
  actions: {
    setCount(count: number) {
      this.count = count
    },
    setName(name: string) {
      this.name = name
    }
  }
})

export default useAppStore
