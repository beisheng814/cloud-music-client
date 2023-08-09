<template>
  <div class="page-lyric" :style="{ background: pageLyricBg }">
    <div class="outShow flex-center cup" @click="emit('showLyricBox')">
      <icon-down :size="18" />
    </div>
    <div class="content">
      <div class="content-left content-item noselect">
        <div class="needle">
          <img src="@/assets/img/ic_needle.png" alt="" />
        </div>
        <div class="pic-box">
          <div class="big circle"></div>
          <div class="small circle"></div>
          <img class="pic circle" ref="picRef" :src="info.cover" alt="" />
        </div>
      </div>
      <div class="content-right content-item">
        <div class="content-right-top">
          <div class="title text-1">
            {{ info.name }}
          </div>
          <a-space class="gray" :size="16">
            <span class="text-1">歌手: {{ info.artist }}</span>
          </a-space>
        </div>
        <div class="content-right-lyric" ref="lyricBoxRef" @mousewheel="handleScroll" @scroll="handleScrollTop">
          <div class="play-time">
            <div class="play-time-right">
              <div class="time" v-if="lrcArr.length">{{ formatTime(lrcArr[index].time) }}</div>
              <div class="line"></div>
            </div>
            <div class="play-time-left">
              <div class="line"></div>
              <icon-caret-right :size="18" class="cup" @click="emit('seekPlay', lrcArr[index].time)" />
            </div>
          </div>
          <div class="scroll-box" ref="scrollBoxRef">
            <div class="lyric-item" v-for="i in 4" :key="i"></div>
            <template v-for="(item, i) in lrcArr" :key="i">
              <div class="lyric-item" :class="index === i ? 'lyric-item-active' : ''" v-if="item.lrc">{{ item.lrc }}</div>
            </template>
            <div class="lyric-item" v-for="i in 4" :key="i"></div>
          </div>
        </div>
      </div>
    </div>
    <canvas id="canvas" style="display: none"></canvas>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, toRefs, watch, computed } from 'vue'
  import { debounce } from 'lodash'
  import { useSongStore } from '@/store'
  import { formatTime } from '@/util/index'

  interface infoType {
    url: string
    artist: string
    cover: string
    name: string
    tns: string
  }
  const songStore = useSongStore()
  const index = ref(0)
  const ctime = computed(() => songStore.getCurrentTime)
  const lrcArr = computed(() => songStore.getLrcArr)
  const emit = defineEmits(['showLyricBox', 'seekPlay'])
  const props = defineProps({
    info: {
      type: Object as () => infoType,
      required: true
    },
    isPlay: {
      type: Boolean,
      required: true
    }
  })
  const { info, isPlay } = toRefs(props)
  // 设置播放指针和磁盘旋转
  const toggleRotation = () => {
    const box = document.querySelector('.pic-box') as any
    const needle = document.querySelector('.needle') as any
    if (isPlay.value) {
      box.classList.add('rotate')
      needle.classList.add('rotate')
    } else {
      box.classList.remove('rotate')
      needle.classList.remove('rotate')
    }
  }
  // 设置背景色
  const picRef = ref()
  const pageLyricBg = ref('rgba(255,255,255,1)')
  const setPicColorBg = async () => {
    var img = new Image()
    var canvas = document.getElementById('canvas') as any
    var ctx = canvas.getContext('2d')
    img.onload = function () {
      ctx.drawImage(img, 0, 0)
      img.style.display = 'none'
      ctx.getImageData(0, 0, img.width, img.height).data
      // 获取Canvas上某个像素的颜色
      var pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      var red = 0,
        green = 0,
        blue = 0

      // 计算所有像素的颜色平均值
      for (var i = 0; i < pixelData.length; i += 4) {
        red += pixelData[i]
        green += pixelData[i + 1]
        blue += pixelData[i + 2]
      }
      var pixelCount = pixelData.length / 4
      red = Math.round(red / pixelCount)
      green = Math.round(green / pixelCount)
      blue = Math.round(blue / pixelCount)
      // 需要浅一点就把透明度调低
      pageLyricBg.value = `linear-gradient(rgba(${red},${green},${blue}, .5), rgba(255,255,255,1))`
    }
    img.src = info.value.cover
    img.crossOrigin = 'anonymous'
  }

  const isUserScroll = ref(false)
  const scrollBoxRef = ref()
  const lyricBoxRef = ref()
  const heightsArr = ref<number[]>([])
  // 设置歌词滚动位置
  const setLrcPosition = () => {
    // 使用 querySelectorAll() 方法获取具有相同类名的所有元素
    const elements = document.querySelectorAll('.lyric-item')
    // 使用 map() 方法遍历每个元素并获取其高度
    const heights = Array.from(elements).map(element => element.clientHeight)
    heightsArr.value = heights
    // 获取播放了的总高度
    const sHeight = heights.slice(0, index.value).reduce((sum, item) => sum + item, 0)
    let ii = 0
    lrcArr.value.forEach((item, i) => {
      if (item.time < ctime.value) {
        ii = i
      }
    })
    index.value = ii
    lyricBoxRef.value.scrollTop = sHeight
  }

  // 获取滚动高度后 中间那条数据在数据的第几个下标
  function getSumGreaterThanNumber(arr: number[], total: number) {
    let sum = 0
    let index = 0
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i]
      index++
      if (sum > total) {
        break
      }
    }
    return index
  }

  const handleScrollTop = (event: any) => {
    if (isUserScroll.value) {
      const top = event.target.scrollTop
      index.value = getSumGreaterThanNumber(heightsArr.value, top) - 1
    }
  }
  // 监听用户鼠标滚动事件
  const handleScroll = () => {
    isUserScroll.value = true
    handleScrollEnd()
  }
  // 3秒后立即执行且重置修改滚动位置事件可触发
  const handleScrollEnd = debounce(function () {
    setLrcPosition()
    isUserScroll.value = false
  }, 3000)

  // 更新了播放状态
  watch(isPlay, () => {
    toggleRotation()
  })
  // 更新了歌曲信息  切换歌曲
  watch(info, () => {
    setPicColorBg()
  })
  // 更新了歌曲播放时间
  watch(ctime, () => {
    if (!isUserScroll.value) {
      setLrcPosition()
    }
  })
  onMounted(() => {
    setPicColorBg()
    toggleRotation()
    setLrcPosition()
  })
</script>

<style lang="less" scoped>
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .page-lyric {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .outShow {
      position: absolute;
      width: 48px;
      height: 48px;
    }
    .content {
      margin: 0 auto;
      margin-top: 56px;
      width: 840px;
      display: flex;
      &-item {
        width: 50%;
        height: 540px;
      }
      &-left {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        .needle {
          width: 100px;
          height: 160px;
          z-index: 1;
          position: relative;
          top: -50px;
          transform: rotate(-35deg);
          transition: transform 0.5s ease;
          img {
            position: absolute;
            top: 70px;
            left: 32px;
            width: 100px;
          }
          &.rotate {
            transform: rotate(0deg);
          }
        }
        .pic-box {
          width: 340px;
          height: 340px;
          position: absolute;
          top: 120px;
          animation: rotate 20s linear infinite;
          animation-play-state: paused;

          &.rotate {
            animation-play-state: running;
          }

          &.paused {
            animation-play-state: paused;
          }
          .circle {
            border-radius: 50%;
            position: absolute;
          }
          .big {
            width: 340px;
            height: 340px;
            background: #dedede;
          }
          .small {
            top: 15px;
            left: 15px;
            width: 310px;
            height: 310px;
            background: #000;
          }
          .pic {
            top: 50px;
            left: 50px;
            width: 240px;
            height: 240px;
          }
        }
      }
      &-right {
        margin-top: 24px;
        display: flex;
        flex-direction: column;
        position: relative;
        &-top {
          margin-bottom: 24px;
          padding-left: 46px;
          height: 64px;
          .title {
            font-size: 26px;
          }
        }
        &-lyric {
          flex: 1;
          overflow: auto;
          &:hover .play-time {
            display: flex;
          }
          .play-time {
            position: absolute;
            z-index: 1;
            top: 282px;
            width: 100%;
            padding-right: 24px;
            display: none;
            align-items: center;
            justify-content: space-between;
            &-right,
            &-left {
              display: flex;
              align-items: center;
            }
            .time {
              margin-right: 6px;
            }
            .line {
              width: 48px;
              height: 1px;
              background: #999999;
            }
          }
          .scroll-box {
            padding-left: 46px;
          }
          .lyric-item {
            font-size: 15px;
            min-height: 48px;
            color: rgba(0, 0, 0, 0.8);
            &-active {
              font-size: 15px;
              font-weight: 700;
              color: rgba(0, 0, 0, 1);
            }
          }
        }
      }
    }
  }
</style>
