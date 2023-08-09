<template>
  <div class="lyric-box noselect" @mousedown="onMouseDown" @mouseup="onMouseUp" @mousemove="onMouseMove">
    <div class="top">
      <icon-close class="operation-btn cup head-all-hover" @click="close" />
    </div>
    <div class="t-lyric" id="lrcId" :style="{ color, fontSize }" v-if="fontLyric.length">
      <div class="t-lyric-item" v-for="(item, i) in fontArr" :key="i">{{ item.l }}</div>
    </div>
    <div class="lyric" id="lrcId" :style="{ color, fontSize }" v-else>{{ lrcStr }}</div>
  </div>
</template>

<script setup lang="ts">
  // 在新创建的第二个窗口中，Vue 组件只是作为一个渲染进程运行，它无法直接访问到主窗口中的 Vue 实例的数据和方法。为了在两个窗口之间进行数据通信，你需要使用 Electron 的 IPC（进程间通信）机制来传递消息。 用store只会拿到创建时的数据  后续不会改变 不可用
  import { ref, onMounted, watch, nextTick } from 'vue'
  import { getLyricNew } from '@/api/song'
  import { formatFontLyric } from '@/util/index'
  interface FontItem {
    l: string
    k: number
    c: number
  }
  const isDown = ref(false)
  let downX = 0
  let downY = 0
  const onMouseDown = (event: any) => {
    const { clientX, clientY } = event
    downX = clientX
    downY = clientY
    // 处理鼠标按下的逻辑
    isDown.value = true
  }
  const onMouseUp = () => {
    // 处理鼠标抬起的逻辑
    isDown.value = false
  }
  const onMouseMove = (event: any) => {
    // 处理鼠标移动的逻辑
    if (isDown.value) {
      const { screenX, screenY } = event
      const x = screenX - downX
      const y = screenY - downY
      window.electronAPI.moveNewWin(x, y)
    }
  }

  const fontSize = ref('32px')
  const color = ref('#FFFFFF')
  const currentTime = ref(0)
  const lrcStr = ref('加载中...')
  const lrcArr = ref([])
  const songId = ref(0)
  const fontArr = ref<FontItem[]>([])
  const fontCTime = ref(0)
  const fontLyric = ref([])
  // 创建一个存储所有定时器ID的数组
  const timerIds: (string | number | NodeJS.Timeout | undefined)[] = []

  const setLrc = () => {
    // 优先使用逐字歌词  没有就使用普通歌词
    if (fontLyric.value.length) {
      getFontArr()
    } else if (lrcArr.value.length) {
      let ii = 0
      lrcArr.value.forEach((item: any, i: number) => {
        if (item.time < currentTime.value) {
          ii = i
        }
      })
      if (lrcStr.value !== (lrcArr.value[ii] as any).lrc) {
        lrcStr.value = (lrcArr.value[ii] as any).lrc || '加载中...'
      }
    }
  }

  // 获取当前句的逐字时间数组
  const getFontArr = () => {
    if (!fontLyric.value.length) {
      return
    }
    let ii = 0
    const playTime = currentTime.value * 1000
    fontLyric.value.forEach((item: any, i: number) => {
      // 有持续时间才触发
      if (item.cTime) {
        if (item.t < playTime) {
          ii = i
        }
      }
    })
    fontArr.value = (fontLyric.value[ii] as any).fontArr || [{ l: (fontLyric.value[ii] as any).lrc, k: 0, c: 0 }]
    // console.log((fontLyric.value[ii] as any).lrc, fontArr.value)
    // 使用reduce方法来计算c字段的总和
    if ((fontLyric.value[ii] as any).fontArr) {
      fontCTime.value = (fontLyric.value[ii] as any).fontArr.reduce((acc: number, curr: any) => acc + curr.c, 0) || 0
    }
  }
  // 设置动效
  const setTransition = () => {
    if (!fontArr.value.length) {
      return
    }
    // 清除所有的定时器
    for (let i = 0; i < timerIds.length; i++) {
      clearTimeout(timerIds[i])
      clearInterval(timerIds[i])
    }
    // nextTick更新dom后获取新的歌词dom否则是上一次的长度
    nextTick(() => {
      // 清空原来的时间及背景色
      const elements = document.querySelectorAll('.t-lyric-item')
      elements.forEach((element: any) => {
        element.style.transition = `background-size 0s linear`
        element.style.backgroundSize = `0% 100%`
      })
      let currentIndex = 0
      function updateProgress(item: any) {
        const element = elements[currentIndex] as any
        console.log(currentIndex, item.l, element)
        if (element) {
          element.style.transition = `background-size ${item.c / 1000}s linear`
          element.style.backgroundSize = `100% 100%`
        }
      }
      function executeNext() {
        if (currentIndex < fontArr.value.length) {
          const item = fontArr.value[currentIndex] as any
          updateProgress(item)
          const delay = item.c
          timerIds.push(setTimeout(executeNext, delay))
          currentIndex++
        }
      }
      executeNext()
    })
  }

  watch(fontArr, () => {
    setTransition()
  })
  // 歌曲id变化
  watch(songId, () => {
    fontLyric.value = []
    fontArr.value = []
    getLyricNew(songId.value).then(res => {
      const { code, yrc } = res
      if (code === 200 && yrc) {
        fontLyric.value = formatFontLyric(yrc.lyric) as any
        getFontArr()
      } else {
        // 没有逐字歌词
      }
    })
  })
  const close = () => {
    window.tools.newClose()
  }
  onMounted(() => {
    setLrc()
    // 时间改变
    window.electronAPI.changeNewWindowTime((_event: any, time: number) => {
      currentTime.value = time
      setLrc()
    })
    // 数据、状态改变
    window.electronAPI.getLrcWinData((_event: any, isPlay: boolean, id: number, lrc: any) => {
      lrcArr.value = JSON.parse(lrc)
      songId.value = id
      if (!isPlay) {
        // 清除所有的定时器
        for (let i = 0; i < timerIds.length; i++) {
          clearTimeout(timerIds[i])
          clearInterval(timerIds[i])
        }
      }
    })
  })
</script>

<style lang="less" scoped>
  .lyric-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 10px;
    padding: 0 24px;
    &:hover {
      background: rgba(104, 100, 101, 0.2);
      .top {
        visibility: visible;
      }
    }
    .top {
      width: max-content;
      margin: 0 auto;
      height: 52px;
      display: flex;
      align-items: center;
      visibility: hidden;
    }
    .lyric {
      width: max-content;
      filter: drop-shadow(0 0 12px #e66f96);
      -webkit-text-stroke: 1px rgb(233, 142, 142);
      background: #ffffff -webkit-linear-gradient(left, red, red) no-repeat 0 0;
      -webkit-text-fill-color: transparent;
      -webkit-background-clip: text;
      background-size: 0 100%;
    }
    .t-lyric {
      display: flex;
      // flex-wrap: wrap;
      &-item {
        width: max-content;
        min-width: 32px;
        filter: drop-shadow(0 0 12px #e66f96);
        -webkit-text-stroke: 1px rgb(233, 142, 142);
        background: #ffffff -webkit-linear-gradient(left, red, red) no-repeat 0 0;
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        background-size: 0 100%;
      }
    }
  }
</style>
