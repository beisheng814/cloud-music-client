<template>
  <a-list hoverable :bordered="false" :split="false" class="pointer">
    <a-list-item :class="pathName == item.path ? 'act-item' : ''" v-for="item in menuList" :key="item.id + item.path" @click="changeSelected(item.path)">
      {{ item.name }}
    </a-list-item>
    <span class="gray" style="margin-left: 16px">我的音乐</span>
    <a-list-item :class="pathName == item.path ? 'my-item item' : 'item'" v-for="item in myList" :key="item.id + item.path" @click="changeSelected(item.path)">
      <div class="item">
        <div>
          <component v-if="item.before" :is="item.before" :size="18" />
          {{ item.name }}
        </div>
        <component v-if="item.after" :is="item.after" :size="18" />
      </div>
    </a-list-item>
  </a-list>
</template>
<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useSongStore } from '@/store'
  import { IconHeart, IconStrikethrough, IconDownload } from '@arco-design/web-vue/es/icon'

  const router = useRouter()
  const route = useRoute()
  const pathName = computed(() => route.name)
  const songStore = useSongStore()
  const menuList = [
    { id: '01', name: '发现音乐', path: 'Find' },
    { id: '02', name: '播客', path: 'Podcast' },
    { id: '03', name: '视频', path: 'Video' },
    { id: '04', name: '关注', path: 'Care' },
    { id: '05', name: '直播', path: 'Live' },
    { id: '06', name: '私人漫游', path: 'Private' }
  ]
  const myList = [
    { id: '01', name: '我喜欢的音乐', path: 'LikeList', before: IconHeart, after: IconStrikethrough },
    { id: '02', name: '本地与下载', path: 'Download', before: IconDownload, after: '' }
  ]

  const changeSelected = (path: string) => {
    if (path === 'LikeList') {
      songStore.setDetailSongId(2903444975)
    }
    router.push({ name: path })
  }
</script>
<style scoped lang="less">
  .act-item {
    font-size: 18px;
    font-weight: 600;
    background-color: rgb(247, 248, 250);
  }
  .list-hover :hover {
    cursor: pointer; //鼠标变手
  }

  .my-item {
    background-color: rgb(247, 248, 250);
  }
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
