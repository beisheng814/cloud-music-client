<template>
  <div class="search">
    <a-trigger v-model:popup-visible="visible" trigger="click" class="search-trigger" :popup-translate="[0, 18]" @show="getSearchDefaultData">
      <a-input v-model:model-value="searchData" :placeholder="searchPlaceholder" @keydown.enter="search">
        <template #prefix>
          <icon-search style="color: rgba(255, 255, 255, 0.8)" />
        </template>
      </a-input>
      <template #content>
        <div class="search-suggest noselect" v-if="isSuggest">
          <div class="search-suggest-item" v-for="(item, i) in suggestData.order" :key="i">
            <div class="item-title">{{ suggestTitleObj[item] }}</div>
            <div class="item-content" v-for="(c, ci) in suggestData[item]" :key="ci" @click="goPage(c)">
              <span>{{ c.name }} </span>
              <!-- 单曲-作者 -->
              <template v-if="c.artists">
                <span> - </span>
                <span v-for="(ar, arI) in c.artists" :key="ar.id"><span v-if="arI">/</span>{{ ar.name }}</span>
              </template>
              <!-- 专辑-作者 -->
              <template v-if="c.artist">
                <span> - </span>
                <span> {{ c.artist.name }} </span>
              </template>
            </div>
          </div>
        </div>
        <div class="search-history-hot noselect" v-else>
          <div class="search-history" v-if="searchHistory.length">
            <div class="search-history-hot-title">搜索历史</div>
            <a-space wrap>
              <a-tag v-for="(tag, index) of searchHistory" :key="index">
                <a-space>{{ tag }} <icon-close style="cursor: pointer" @click="tagRemove(index)" /></a-space>
              </a-tag>
            </a-space>
          </div>
          <div class="search-hot">
            <div class="search-history-hot-title">热搜榜</div>
            <div class="search-hot-item" v-for="(item, i) in searchHotData" :key="i" @click="changeHotSearch(item.searchWord)">
              <div class="index" :style="{ color: i < 3 ? '#ec4141' : '#bcbcbc' }">{{ i + 1 }}</div>
              <div class="data">
                <div class="data-top">
                  <a-space>
                    <span class="data-top-name">{{ item.searchWord }}</span>
                    <i class="iconfont icon-HOT-copy" v-if="i === 0"></i>
                    <span class="data-top-hot-num">{{ item.score }}</span>
                  </a-space>
                </div>
                <div class="data-bottom">
                  <span class="text-1">{{ item.content }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </a-trigger>
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted, computed, watch } from 'vue'
  import { getSearchDefault, getSearchHotDetail, getSearchSuggest } from '@/api/search'
  import { useUserStore } from '@/store'
  import { debounce } from 'lodash'
  import { useRouter } from 'vue-router'
  const router = useRouter()

  const userStore = useUserStore()
  const searchData = ref('')
  // 是否是建议列表
  const isSuggest = ref(false)
  const visible = ref(false)

  interface defaultType {
    id: number
    name: string
    [x: string]: any
  }
  interface suggestDataType {
    order: ('songs' | 'artists' | 'albums' | 'playlists')[]
    songs?: defaultType[]
    artists?: defaultType[]
    albums?: defaultType[]
    playlists?: defaultType[]
  }
  const suggestData = ref<suggestDataType>({
    order: [],
    songs: [],
    artists: [],
    albums: [],
    playlists: []
  })
  const suggestTitleObj: { [key: string]: string } = {
    songs: '单曲',
    artists: '歌手',
    albums: '专辑',
    playlists: '歌单'
  }
  const searchPlaceholder = ref('')
  // 搜索建议
  const suggest = debounce(function () {
    if (searchData.value) {
      const keywords = searchData.value
      getSearchSuggest({ keywords }).then(res => {
        const { code, result } = res
        if (code === 200) {
          if (result.order) {
            isSuggest.value = true
          } else {
            isSuggest.value = false
          }
          suggestData.value = result
        }
      })
    } else {
      isSuggest.value = false
    }
  }, 500)
  // 搜索文本改变 显示建议
  watch(searchData, suggest)
  // 搜索
  const searchHistory = computed(() => userStore.getSearchHistoryList)
  const search = debounce(function () {
    visible.value = false
    // 空值直接搜索将默认值作为搜索条件
    if (!searchData.value) {
      searchData.value = searchPlaceholder.value
    }
    const query = {
      searchData: searchData.value
    }
    userStore.setSearchHistoryList([searchData.value, ...searchHistory.value])
    router.push({ name: 'SearchDetail', query })
  }, 500)
  const tagRemove = (index: number) => {
    const tags = [...searchHistory.value]
    tags.splice(index, 1)
    userStore.setSearchHistoryList(tags)
  }
  const changeHotSearch = (val: string) => {
    searchData.value = val
    search()
  }

  const goPage = (v: defaultType) => {
    if (v.artists) {
      console.log('单曲', v)
    } else if (v.artist) {
      console.log('专辑', v)
    } else if (v.coverImgUrl) {
      console.log('歌单', v)
    } else if (v.picUrl) {
      console.log('歌手', v)
    }
  }
  interface searchHotType {
    searchWord: string
    content: string
    score: string
  }
  const searchHotData = ref<searchHotType[]>([])
  // 获取默认数据 热搜/关键字
  const getSearchDefaultData = () => {
    // 获取默认搜索关键字
    getSearchDefault().then(res => {
      const { code, data } = res
      if (code === 200) {
        searchPlaceholder.value = data.showKeyword
      }
    })
    getSearchHotDetail().then(res => {
      const { code, data } = res
      if (code === 200) {
        searchHotData.value = data || []
      }
    })
  }

  onMounted(() => {
    getSearchDefaultData()
  })
</script>
<style lang="less" scoped>
  .search {
    margin-left: 72px;
    :deep(.arco-input-wrapper) {
      width: 240px;
      border-radius: 40px;
      background: rgba(0, 0, 0, 0.1);
      color: #fff;
      input::placeholder {
        color: rgba(255, 255, 255, 0.8);
        font-style: italic;
      }
      &:focus-within,
      &.arco-input-focus {
        border-color: rgba(236, 65, 65, 0.1);
      }
    }
    &-suggest {
      width: 380px;
      max-height: 460px;
      padding-bottom: 12px;
      overflow-x: auto;
      padding-left: 12px;
      &-item {
        .item-title {
          color: #bcbcbc;
          margin: 8px 0;
        }
        .item-content {
          margin-left: -12px;
          padding-left: 24px;
          height: 32px;
          line-height: 32px;
          &:hover {
            background: rgba(0, 0, 0, 0.05);
          }
        }
      }
    }
    &-history-hot {
      width: 360px;
      height: 460px;
      overflow-x: auto;
      padding-left: 12px;
      &-title {
        color: #bcbcbc;
        margin: 8px 0;
      }
    }
    &-history {
      color: #000;
    }
    &-hot {
      &-item {
        display: flex;
        align-items: center;
        padding: 8px 0;
        padding-left: 12px;
        margin-left: -12px;
        height: 58px;
        &:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        .index {
          padding-right: 24px;
          font-size: 14px;
        }
        .data {
          font-size: 12px;
          &-top {
            display: flex;
            margin-bottom: 4px;
            &-name {
              color: #000;
              font-weight: 600;
            }
            .icon-HOT-copy {
              color: red;
              font-size: 32px;
              line-height: 18px;
            }
            &-hot-num {
              color: #bcbcbc;
            }
          }
        }
      }
    }
  }
</style>
