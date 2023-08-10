<template>
  <div class="scroll-box" ref="scrollBoxRef">
    <div class="search-box">
      <div class="search-top">
        <h2>搜索 {{ searchStr }}</h2>
      </div>
      <div class="search-content">
        <div class="tabs noselect">
          <ul>
            <li v-for="item in tabsType" :key="item.value" :class="tabsIndex === item.value ? 'active-li cup' : 'cup'" @click="changeTabs(item.value)">
              {{ item.name }}
            </li>
          </ul>
          <span class="tip">{{ totalStr }}</span>
        </div>
        <Single v-if="tabsIndex === 1" :keywords="searchStr" @scrollTop="setScrollTop" @total-str="setTotalStr" />
        <Singer v-if="tabsIndex === 100" :keywords="searchStr" :type="100" @scrollTop="setScrollTop" @total-str="setTotalStr" />
        <Video v-if="tabsIndex === 1014" :keywords="searchStr" :type="1014" @scrollTop="setScrollTop" @total-str="setTotalStr" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, watchEffect } from 'vue'
  import { useRoute } from 'vue-router'
  import Single from './components/Single.vue'
  import Singer from './components/Singer.vue'
  import Video from './components/Video.vue'

  const route = useRoute()
  const searchStr = ref('')
  const tabsIndex = ref(1)
  const totalStr = ref('')
  const tabsType = [
    { name: '单曲', value: 1 },
    { name: '歌手', value: 100 },
    { name: '专辑', value: 10 },
    { name: '视频', value: 1014 },
    { name: '歌单', value: 1000 },
    { name: '歌词', value: 1006 },
    { name: '播客', value: 0 },
    { name: '声音', value: 2000 },
    { name: '用户', value: 1004 }
  ]
  watchEffect(() => {
    const { searchData } = route.query as any
    searchStr.value = searchData
    tabsIndex.value = 1
  })
  const changeTabs = (val: number) => {
    tabsIndex.value = val
    totalStr.value = ''
  }
  const setTotalStr = (val: string) => {
    totalStr.value = val
  }
  const scrollBoxRef = ref()
  // 将一个元素滚动条到顶部
  const setScrollTop = () => {
    scrollBoxRef.value.scrollTop = 0
  }
</script>
<style lang="less" scoped>
  .scroll-box {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .search-box {
    padding: 20px;
    .search-top {
      margin-bottom: 12px;
    }
    .search-content {
      .tabs {
        display: flex;
        align-items: center;
        justify-content: space-between;
        ul {
          display: flex;
          li {
            margin-right: 24px;
            padding-bottom: 2px;
            &.active-li {
              font-weight: 700;
              border-bottom: 2px solid #ec4141;
            }
          }
        }
        .tip {
          color: #999999;
        }
      }
    }
  }
</style>
