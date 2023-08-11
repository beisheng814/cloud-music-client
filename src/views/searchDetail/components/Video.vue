<template>
  <a-spin :loading="loading" tip="加载中...">
    <div class="video-content">
      <template v-for="(item, i) in videoData" :key="item.vid + i">
        <VideoItem :data="item" :type="'mv'" class="cup" @click="goVideoDetail(item, 1)" />
      </template>
    </div>
    <VideoDetailModel ref="videoDetailRef" />
    <div class="pagination" v-if="pagination.total > 30">
      <a-pagination :total="pagination.total" @change="onPageChange" />
    </div>
  </a-spin>
</template>
<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import VideoItem from '@/components/VideoItem.vue'
  import VideoDetailModel from '@/views/details/videoDetailModel.vue'
  import useSearch from '@/hooks/useSearch'
  import { useSongStore } from '@/store'

  const songStore = useSongStore()

  const videoDetailRef = ref()
  interface videoDataItem {
    durationms: number
    playTime: number
    previewUrl: string
    vid: string
    coverUrl: string
    title: string
    creator: any
    [key: string]: any // 使用索引签名表示未知个数的属性和属性值
  }
  const videoData = ref<any[]>([])
  const emit = defineEmits(['scrollTop', 'totalStr'])
  const props = defineProps({
    keywords: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      default: 1
    }
  })
  const { codes, results, loading, pagination, onPageChange, getTable } = useSearch(props)
  watch(results, () => {
    if (codes.value === 200) {
      emit('scrollTop')
      console.log(results)
      videoData.value = results.value.videos
      pagination.total = results.value.videoCount
      emit('totalStr', `找到${results.value.videoCount}个视频`)
    }
  })
  const goVideoDetail = (item: videoDataItem, type: number) => {
    // 将播放音乐状态设置为暂停
    songStore.setIsPlay(false)
    // router.push({ name: 'VideoDetail', query: { data: JSON.stringify(item) } })
    videoDetailRef.value.show(item, type, 'mv')
  }
  onMounted(() => {
    getTable()
  })
</script>
<style scoped lang="less">
  .arco-spin {
    width: 100%;
  }
  .singer {
    padding: 12px 0;
    &:nth-child(odd) {
      background: rgba(245, 245, 245, 0.5);
    }
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
    &-left {
      display: flex;
      align-items: center;
      .singer-avatar {
        margin-right: 10px;
        width: 72px;
        height: 72px;
        border-radius: 12px;
        overflow: hidden;
      }
    }
  }
  .pagination {
    width: max-content;
    margin: 0 auto;
    margin-top: 20px;
  }
  
  .video-content {
      margin-top: 24px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      grid-gap: 24px;
      &-item {
        height: 40px;
        background: pink;
      }
    }
</style>
