<template>
  <div class="video-item">
    <div class="top" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <div class="play-count" v-if="data.playTime"><icon-play-arrow />{{ numFormat(data.playTime) }}</div>
      <img v-if="isHover" :src="data.previewUrl + '&t=' + new Date().getTime()" alt="" class="pic preview" />
      <img v-if="!isHover" :src="data.coverUrl" alt="" class="pic" />
      <div class="time">{{ formatTime(data.durationms / 1000) }}</div>
      <div class="playBtn" ref="playBtnRef"><icon-play-arrow-fill size="24" /></div>
    </div>
    <div class="content">
      <div class="title text-1">
        {{ data.title }}
      </div>
      <div class="name" v-if="type === 'video'">
        by <span> {{ data.creator.nickname }}</span>
      </div>
      <div class="name" v-else>
        <span v-for="(item,i) in data.creator" :key="item.userId"><template v-if="i">/</template> {{ item.userName }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { numFormat, formatTime } from '@/util/index'
  import { ref, toRefs } from 'vue'

  const isHover = ref(false)
  interface Item {
    durationms: number
    playTime: number
    previewUrl: string
    coverUrl: string
    title: string
    creator: any
    [key: string]: any // 使用索引签名表示未知个数的属性和属性值
  }
  const props = defineProps({
    data: {
      type: Object as () => Item,
      required: true,
      default: () => ({ name: 'Default Item' })
    },
    type: {
      type: String,
      required: true,
      default: 'video'
    }
  })
  const playBtnRef = ref()
  const timer = ref()
  const { data } = toRefs(props)
  const handleMouseEnter = () => {
    // 没有预览图直接返回
    if (props.data.previewUrl) return
    const time = props.data.previewDurationms
    if (time) {
      clearTimeout(timer.value)
      timer.value = null
      isHover.value = true
      timer.value = setTimeout(() => {
        playBtnRef.value && playBtnRef.value.classList.add('show')
      }, time)
    } else {
      playBtnRef.value && playBtnRef.value.classList.add('show')
    }
  }
  const handleMouseLeave = () => {
    isHover.value = false
    clearTimeout(timer.value)
    timer.value = null
    playBtnRef.value && playBtnRef.value.classList.remove('show')
  }
</script>

<style lang="less" scoped>
  .video-item {
    .top {
      width: 100%;
      position: relative;
      padding-bottom: 56.25%; /* 16:9 宽高比 */
      overflow: hidden;
      height: 0;
      .pic {
        float: left;
        width: 100%;
      }
      .preview {
        z-index: 1;
      }
      .play-count,
      .time {
        position: absolute;
        color: #ffffff;
        width: 100%;
        padding-right: 8px;
        font-size: 12px;
        text-align: right;
      }
      .play-count {
        top: 0;
        padding-top: 2px;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(255, 255, 255, 0));
      }
      .time {
        bottom: 0;
        padding-bottom: 2px;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.5));
      }
      .playBtn {
        position: absolute;
        top: calc(50% - 15px);
        right: calc(50% - 15px);
        color: red;
        padding-top: 2px;
        display: none;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 50%;
        background-color: white;
      }
      .show {
        display: block;
      }
    }
    .name {
      color: #999;
      font-size: 12px;
    }
  }
</style>
