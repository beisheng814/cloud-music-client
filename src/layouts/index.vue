<template>
  <a-layout class="layout">
    <a-layout-header><Header @refresh="refresh"></Header></a-layout-header>
    <a-layout class="layout-content">
      <!-- 菜单 -->
      <a-layout-sider style="width: 200px" class="sider-box noselect">
        <LayoutSider />
      </a-layout-sider>
      <a-layout-content v-if="isContent">
        <router-view />
      </a-layout-content>
    </a-layout>
    <a-layout-footer style="height: 72px">
      <LayoutFooter />
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
  import Header from '@/components/Header.vue'
  import LayoutSider from './components/sider.vue'
  import LayoutFooter from './components/footer.vue'
  import { nextTick, ref } from 'vue'

  const isContent = ref(true)
  const refresh = () => {
    isContent.value = false
    nextTick(() => {
      isContent.value = true
    })
  }
</script>

<style lang="less" scoped>
  .layout {
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    .layout-content {
      height: calc(100% - 128px);
    }
  }
  .sider-box {
    /* 隐藏滚动条（仅适用于WebKit内核的浏览器） */
    ::-webkit-scrollbar {
      width: 0; /* 设置滚动条的宽度为0，隐藏滚动条 */
      background: transparent; /* 设置滚动条的背景色为透明 */
    }

    /* 隐藏滚动条轨道 */
    ::-webkit-scrollbar-track {
      background: transparent; /* 设置滚动条轨道的背景色为透明 */
    }

    /* 隐藏滚动条滑块 */
    ::-webkit-scrollbar-thumb {
      background: transparent; /* 设置滚动条滑块的背景色为透明 */
    }
  }
  .sider-box:hover {
    /* 定义滚动条的基本样式 */
    ::-webkit-scrollbar {
      width: 8px; /* 滚动条的宽度 */
      height: 8px;
    }

    /* 定义滚动条滑块的样式 */
    ::-webkit-scrollbar-thumb {
      background-color: rgba(136, 136, 136, 0.5); /* 滑块的背景颜色 */
      border-radius: 5px; /* 滑块的圆角弧度 */
    }

    /* 定义滚动条轨道的样式 */
    ::-webkit-scrollbar-track {
      background-color: #f1f1f1; /* 轨道的背景颜色 */
      border-radius: 5px; /* 轨道的圆角弧度 */
    }

    /* 当滚动条处于被悬停状态时的样式 */
    ::-webkit-scrollbar-thumb:hover {
      background-color: #555; /* 悬停时的背景颜色 */
    }
  }
</style>
