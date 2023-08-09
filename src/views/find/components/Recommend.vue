<template>
  <div class="container">
    <div class="banner">
      <a-carousel
        :autoPlay="true"
        animation-name="card"
        show-arrow="hover"
        indicator-type="dot"
        :style="{
          width: '100%',
          height: '100%'
        }"
      >
        <a-carousel-item v-for="image in bannerData" :style="{ width: '60%' }">
          <img
            :src="(image as any).imageUrl"
            :style="{
              width: '100%',
              borderRadius: '12px'
            }"
          />
        </a-carousel-item>
      </a-carousel>
    </div>
  </div>
  <div class="recommend-song-list">
    <div class="recommend-song-list-title" @click="goTab('songList')">推荐歌单<icon-right /></div>
    <div class="song-list">
      <div v-for="(item, index) in resourceListData" class="song-list-item" :key="index">
        <ListItem @box-click="getSongList(item)" @play-click="playSongList(item)" :listItem="item" :size="'100%'" style="margin-bottom: 24px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import ListItem from '@/components/ListItem.vue'
  import { getBanner, getPlayTrackAll, getResource } from '@/api/find'
  import { useFindStore, useSongStore } from '@/store'
  // import { getRandomIndexes } from '@/util/index'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const findStore = useFindStore()
  const songStore = useSongStore()
  const bannerData = computed(() => findStore.getBannerList)
  // const resourceListData = computed(() => getRandomIndexes(findStore.getResourceList, 10))
  const resourceListData = computed(() => findStore.getResourceList.slice(0, 10))

  const emit = defineEmits(['changTab'])
  const goTab = (name: string) => {
    emit('changTab', name)
  }
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
  onMounted(() => {
    getBanner().then((res: any) => {
      const { banners, code } = res
      if (code === 200) {
        findStore.setBannerList(banners)
      }
    })
    getResource().then((res: any) => {
      const { code, recommend } = res
      if (code === 200) {
        // recommend.shift()
        recommend.forEach((item: any) => {
          item.playCount = item.playcount
          return item
        })
        findStore.setResourceList(recommend)
      }
    })
  })
</script>
<style scoped lang="less">
  .container {
    position: relative; /* 设置父容器为相对定位 */
    width: 100%; /* 设置元素的固定宽度 */
    &::before {
      content: '';
      display: block;
      padding-top: 22.4%; /* 设置高度为宽度的比例 */
    }
    .banner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  :deep(.arco-carousel-indicator-wrapper-bottom) {
    background: transparent;
  }
  .recommend-song-list {
    margin: 18px;
    &-title {
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
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
