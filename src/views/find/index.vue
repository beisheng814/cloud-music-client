<template>
  <div class="find noselect">
    <a-tabs v-model:active-key="activeName" default-active-key="recommend">
      <a-tab-pane key="recommend" title="个性推荐">
        <Recommend @chang-tab="changTab" />
      </a-tab-pane>
      <a-tab-pane key="customization" title="专属定制">
        <Exclusive :shouldLoadMore="shouldLoadMore" @changeLoadMore="changeLoadMore" />
      </a-tab-pane>
      <a-tab-pane key="songList" title="歌单"> 歌单 </a-tab-pane>
      <a-tab-pane key="rankings" title="排行榜"> 排行榜 </a-tab-pane>
      <a-tab-pane key="singer" title="歌手"> 歌手 </a-tab-pane>
      <a-tab-pane key="latestMusic" title="最新音乐"> 最新音乐 </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import Recommend from './components/Recommend.vue'
  import Exclusive from './components/Exclusive.vue'
  const activeName = ref('recommend')
  const changTab = (name: string) => {
    activeName.value = name
  }
  const handleScroll = () => {
    const myElement: any = document.querySelector('.arco-tabs-content')
    // 判断是否滚动到底部
    if (myElement.scrollHeight - parseInt(myElement.scrollTop) == myElement.clientHeight) {
      // 执行触底加载的操作
      performLoadMore()
    }
  }
  const shouldLoadMore = ref(false)
  const performLoadMore = () => {
    shouldLoadMore.value = true
  }

  const changeLoadMore = (data: boolean) => {
    shouldLoadMore.value = data
  }
  onMounted(() => {
    const myElement = document.querySelector('.arco-tabs-content')
    if (myElement) {
      myElement.addEventListener('scroll', handleScroll)
    }
  })
</script>

<style lang="less" scoped>
  .find {
    height: 100%;

    :deep(.arco-tabs-nav) {
      margin-top: 12px;
      padding: 0 24px;

      &::before {
        height: 0;
      }

      .arco-tabs-tab {
        color: #333333;
        font-size: 16px;
        margin-left: 0;
        margin-right: 32px;

        &-active {
          color: #000;
          font-weight: 700;
          font-size: 18px;
        }
      }

      .arco-tabs-nav-ink {
        background: #ec4141;
        height: 3px;
      }
    }

    :deep(.arco-tabs) {
      height: 100%;

      &-content {
        height: calc(100% - 60px);
        overflow: auto;

        .arco-tabs-pane {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }
      }
    }
  }
</style>
