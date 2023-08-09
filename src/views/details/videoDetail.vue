<!-- 使用路由跳转有问题 返回回去数据会重新加载未记录位置 暂时弃用 -->
<template>
  <Header />
  <div class="video-detail">
    <div class="left">
      <div class="left-top cup" @click="goBack"><icon-left />视频详情</div>
      <div class="left-content">
        <!-- <div class="video-box" id="dplayer"></div> -->
        <vue3videoPlay :src="videoUrl" width="640px" height="410px" volume="0.7" color="#ec4141" />
      </div>
    </div>
    <div class="right">相关音乐</div>
  </div>
</template>
<script setup lang="ts">
  import { getVideoUrl } from '@/api/video'
  import { onMounted, onBeforeMount, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import Header from '@/components/Header.vue'
  import vue3videoPlay from 'vue3-video-play' // 引入组件
  import 'vue3-video-play/dist/style.css'

  const route = useRoute()
  const router = useRouter()
  const data = ref<any>()
  const vid = ref('')
  const videoUrl = ref('')
  const getVideo = () => {
    getVideoUrl(vid.value).then(res => {
      console.log(res)
      const { code, urls } = res
      if (code === 200) {
        videoUrl.value = urls[0].url
      }
    })
  }
  const goBack = () => {
    router.go(-1)
  }
  onBeforeMount(() => {
    const query = JSON.parse(route.query.data as string)
    data.value = query
    vid.value = query.vid
    getVideo()
  })
</script>
<style scoped lang="less">
  .video-detail {
    width: 1000px;
    height: calc(100% - 56px);
    overflow: auto;
    margin: 0 auto;
    padding: 24px;
    display: flex;
    .left {
      width: 660px;
      padding-right: 20px;
    }
  }
</style>
