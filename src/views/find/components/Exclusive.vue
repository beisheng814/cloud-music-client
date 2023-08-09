<template>
  <!-- 加载中 -->
  <div v-if="isLoading" class="flex-center">载入中...</div>
  <div v-else>
    <!-- 雷达歌单 -->
    <div class="radar-box" v-if="userStore.getUserName">
      <div class="radar-title">{{ userStore.getUserName }}的雷达歌单</div>
      <div class="radar-describe flex-between">
        根据你的红心收藏为你推荐更多宝藏歌曲
        <div class="radar-icon-box flex-between">
          <div :class="isFirstPage ? 'radar-icon__ban' : 'pointer'" class="radar-icon" @click="handlePrePage"><icon-left :strokeWidth="6" /></div>
          <div :class="isLastPage ? 'radar-icon__ban' : 'pointer'" class="radar-icon" @click="handleNextPage()">
            <icon-right :strokeWidth="6" />
          </div>
        </div>
      </div>
      <div class="radar-list" ref="scrollContainer">
        <div v-for="(radarItem, index) in radarList" :key="index">
          <ListItem
            :listItem="radarItem"
            @box-click="getSongList(radarItem)"
            @play-click="playSongList(radarItem)"
            :style="{
              marginRight: isLast(index) ? '' : '24px'
            }"
          />
        </div>
      </div>
    </div>
    <!-- 推荐歌单 -->
    <div class="list-box">
      <div class="list-title">提前开启音乐假日</div>
      <div class="song-list">
        <div v-for="(item, index) in recommendList" class="song-list-item" :key="index">
          <ListItem @box-click="getSongList(item)" @play-click="playSongList(item)" :listItem="item" :size="'100%'" style="margin-bottom: 24px" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, toRefs } from 'vue'
  import ListItem from '@/components/ListItem.vue'
  import { getPersonalized, getPlayTrackAll, playlist } from '@/api/find'
  import { useUserStore, useSongStore } from '@/store/index'
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const userStore = useUserStore()
  const songStore = useSongStore()
  let radarList: any = ref([])
  const scrollContainer: any = ref(null)
  const isLoading: any = ref(null)

  const getSongList = (item: any) => {
    songStore.setDetailSongId(item.id)
    router.push({ name: 'SongList' })
  }
  // 直接播放歌单歌曲
  const playSongList = (item: any) => {
    songStore.setDetailSongId(item.id)
    if (!songStore.getDetailSongId) {
      return
    }
    const params = {
      id: songStore.getDetailSongId
    }
    getPlayTrackAll(params).then((res: any) => {
      songStore.setDetailSongList(res.songs)
      songStore.setPlayList(res.songs)
      songStore.setSongId(res.songs[0].id)
    })
  }

  const props = defineProps({
    shouldLoadMore: Boolean
  })
  const { shouldLoadMore } = toRefs(props)

  onMounted(() => {
    initList()
  })

  //获取雷达歌单
  const getRadarList = () => {
    isLoading.value = true
    getPersonalized().then(res => {
      radarList.value = res.result
      isLoading.value = false
    })
  }
  let startCoumt = ref(0)
  //右箭头
  const handleNextPage = () => {
    if (startCoumt.value < 2) startCoumt.value += 1
    changeScroll(startCoumt.value)
  }
  //左箭头
  const handlePrePage = () => {
    if (startCoumt.value > 0) startCoumt.value -= 1
    changeScroll(startCoumt.value)
  }
  //改变滚动条
  const changeScroll = (changNum: any) => {
    const containerWidth = scrollContainer.value.offsetWidth
    const scrollWidth = scrollContainer.value.scrollWidth
    const maxScroll = scrollWidth - containerWidth
    const scrollPosition = (maxScroll * (50 * changNum)) / 100
    scrollContainer.value.scrollLeft = scrollPosition
  }

  const isLastPage = ref(false)
  const isFirstPage = ref(true)
  //监听是否为首页或尾页
  watch(startCoumt, (newValue, oldValue) => {
    if (newValue === 2) {
      isLastPage.value = true
    } else {
      isLastPage.value = false
    }
    if (newValue === 0) {
      isFirstPage.value = true
    } else {
      isFirstPage.value = false
    }
  })

  const isLast = (index: any) => {
    return index === radarList.value.length - 1
  }

  const params: any = reactive({})
  const limit: any = ref(15)
  const pageCount: any = ref(0)
  let recommendList: any = ref([])
  //刷新
  const initList = () => {
    recommendList.value = []
    pageCount.value = 1
    getList()
    getRadarList()
  }
  const endReached: any = ref(false)
  //触底加载
  const loadMoreList = () => {
    pageCount.value += 1
    getList()
    emigFun('changeLoadMore', false)
  }
  let emigFun = defineEmits(['changeLoadMore'])
  watch(shouldLoadMore, (newValue, oldValue) => {
    if (newValue) loadMoreList()
  })
  //获取歌单列表
  const getList = () => {
    let offset = pageCount.value * limit.value
    Object.assign(params, { limit, offset })
    playlist(params).then(res => {
      recommendList.value.push(...res.playlists)
    })
  }
</script>
<style scoped lang="less">
  .radar-box {
    padding-right: 24px;

    .radar-title {
      font-size: 18px;
      font-weight: 600;
    }

    .radar-describe {
      margin-bottom: 10px;
      font-size: 14px;
      color: rgb(153, 153, 153);
    }

    .radar-list {
      scroll-behavior: smooth;
      display: flex;
      overflow-x: hidden;
    }

    .radar-icon-box {
      width: 56px;

      .radar-icon {
        display: inline-block;
        text-align: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: rgb(235, 235, 235);
      }

      .radar-icon:hover {
        background-color: rgb(214, 214, 214);
      }

      .radar-icon__ban {
        background-color: rgb(245, 245, 245);
      }
    }
  }

  .list-box {
    .list-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .song-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      margin: -12px; /* 负值的间隔，用于撑开间隔空间 */
      &-item {
        width: calc(20% - 24px); /* 元素的宽度，减去间隔空间 */
        margin: 12px; /* 元素之间的间隔 */
      }
    }
  }
</style>
