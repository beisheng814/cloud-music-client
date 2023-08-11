<template>
  <div class="footer noselect z-1000">
    <div class="footer-left">
      <div class="footer-left-song-operation" id="song-operation">
        <div class="down cup flex-center" @click="showLyricBox">
          <icon-down :size="18" />
        </div>
        <a-space>
          <div class="circle flex-center">
            <icon-heart-fill
              v-if="userStore.getLikeIdList.includes(songStore.getSongId)"
              style="color: #ec4141"
              @click="likeSong(songStore.getSongId, false)"
              :size="20"
            />
            <icon-heart v-else @click="likeSong(songStore.getSongId, true)" :size="20" />
          </div>
          <div class="circle flex-center"><icon-plus-circle :size="20" /></div>
          <div class="circle flex-center"><icon-download :size="20" /></div>
          <div class="circle flex-center"><icon-share-internal :size="20" /></div>
        </a-space>
      </div>
      <div class="footer-left-song-info" id="song-info">
        <div class="footer-left-pic cup" v-if="info.cover" @click="showLyricBox">
          <img :src="info.cover" alt="" />
          <div class="up-mask">
            <icon-up :size="18" />
          </div>
        </div>
        <div class="footer-left-info" v-if="info.name">
          <div class="like-box">
            <div class="footer-left-info-name">
              <span class="text">
                {{ info.name }}
                <span v-if="info.tns" class="color-grey"> ({{ info.tns }}) </span>
              </span>
            </div>
            <icon-heart-fill
              v-if="userStore.getLikeIdList.includes(songStore.getSongId)"
              style="color: #ec4141"
              class="cup like-icon"
              @click="likeSong(songStore.getSongId, false)"
              :size="18"
            />
            <icon-heart v-else class="cup like-icon" @click="likeSong(songStore.getSongId, true)" :size="18" />
          </div>
          <div class="footer-left-info-singer text-1">
            {{ info.artist }}
          </div>
        </div>
      </div>
    </div>
    <div class="footer-center">
      <!-- 有音频文件 -->
      <div class="footer-center-top" v-if="info.url">
        <div>
          <a-tooltip v-if="currentMode === 'xd'" content="心动模式"><i class="cup mode-icon iconfont icon-icon_xindong" @click="changeMode(1)"></i></a-tooltip>
          <a-tooltip v-if="currentMode === 'lb'" content="列表循环"><i class="cup mode-icon iconfont icon-24gl-repeat2" @click="changeMode(2)"></i></a-tooltip>
          <a-tooltip v-if="currentMode === 'dq'" content="单曲循环"><i class="cup mode-icon iconfont icon-danquxunhuan" @click="changeMode(3)"></i></a-tooltip>
          <a-tooltip v-if="currentMode === 'sj'" content="随机播放"><i class="cup mode-icon iconfont icon-24gl-shuffle" @click="changeMode(4)"></i></a-tooltip>
          <a-tooltip v-if="currentMode === 'sx'" content="顺序播放"><i class="cup mode-icon iconfont icon-shunxubofang" @click="changeMode(0)"></i></a-tooltip>
        </div>
        <icon-skip-previous-fill class="play-icon cup" @click="previousSong" />
        <div class="play-icon-bg">
          <icon-play-arrow-fill class="play-icon cup" @click="playAudio(true)" v-if="!isPlay" />
          <icon-pause class="play-icon cup" @click="playAudio(false)" v-else />
        </div>
        <icon-skip-next-fill class="play-icon cup" @click="nextSong" />
        <div style="font-size: 16px; cursor: pointer; color: #dc001a" v-if="isShowLyric" @click="close">词</div>
        <div style="font-size: 16px; cursor: pointer" v-else @click="createWindow">词</div>
      </div>
      <!-- 没有音频文件 -->
      <div class="footer-center-top" v-else>
        <div class="gray">
          <i v-if="currentMode === 'xd'" class="iconfont icon-icon_xindong"></i>
          <i v-if="currentMode === 'lb'" class="iconfont icon-24gl-repeat2"></i>
          <i v-if="currentMode === 'dq'" class="iconfont icon-danquxunhuan"></i>
          <i v-if="currentMode === 'sj'" class="iconfont icon-24gl-shuffle"></i>
          <i v-if="currentMode === 'sx'" class="iconfont icon-shunxubofang"></i>
        </div>
        <icon-skip-previous-fill class="play-icon" style="color: gray" />
        <div class="play-icon-bg gray">
          <icon-play-arrow-fill class="play-icon" />
        </div>
        <icon-skip-next-fill class="play-icon" style="color: gray" />
        <div style="font-size: 16px; color: gray">词</div>
      </div>
      <div class="footer-center-bottom">
        <div class="start">{{ formatTime(currentTime) }}</div>
        <div id="aplayer"></div>
        <div class="end">{{ formatTime(totalDuration) }}</div>
      </div>
    </div>
    <div class="footer-right">
      <div class="footer-right-operation">
        <icon-ordered-list style="font-size: 16px; cursor: pointer" @click="setShowList" />
      </div>
    </div>
  </div>
  <div class="list-box" v-if="visible">
    <div class="list-box-top">
      <div class="list-box-top-title">当前播放</div>
      <div class="list-box-top-content">
        <span>总 {{ tableData.length }} 首</span>
        <a-space :size="16">
          <span class="cup">收藏全部</span>
          <span class="cup">清空列表</span>
        </a-space>
      </div>
    </div>
    <div class="list-box-content">
      <a-table
        row-key="title"
        :scroll="{ x: '100%', y: '100%' }"
        :stripe="true"
        :pagination="false"
        :bordered="false"
        :data="tableData"
        :show-header="false"
        :row-class="setRowClass"
        @cell-dblclick="cellDblclick"
      >
        <!-- :virtual-list-props="{ height: 484 }" -->
        <!-- @cell-dblclick="cellDblclick" -->
        <template #columns>
          <a-table-column title="标题" cell-class="song-cell" ellipsis tooltip data-index="name">
            <template #cell="{ record: { name, tns } }">
              <span>{{ name }}</span> <span v-if="tns" class="color-grey">({{ tns[0] }})</span>
            </template>
          </a-table-column>
          <a-table-column title="歌手" cell-class="song-cell" ellipsis tooltip :width="120">
            <template #cell="{ record: { ar } }">
              <span v-for="(item, i) in ar" :key="i"> <span v-if="i !== 0">/</span>{{ item.name }}</span>
            </template>
          </a-table-column>
          <a-table-column title="时间" ellipsis tooltip :width="80">
            <template #cell="{ record: { dt } }">
              <span class="color-grey">{{ formatTime(dt / 1000) }}</span>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
  </div>
  <div class="lyric-box" id="lyricBox"><PageLyric :info="info" :isPlay="isPlay" @seekPlay="seekPlay" @showLyricBox="showLyricBox" /></div>
</template>
<script setup lang="ts">
  import { ref, onMounted, computed, onBeforeUnmount, watch } from 'vue'
  import PageLyric from '@/views/lyric/pageLyric.vue'
  import { useSongStore, useUserStore } from '@/store/index'
  import { formatTime, formatLyric } from '@/util/index'
  import 'APlayer/dist/APlayer.min.css'
  import APlayer from 'APlayer'
  import { shuffle } from 'lodash'
  import { Message, TableData } from '@arco-design/web-vue'
  import { getSongUrl, getLikeSong, getLyric } from '@/api/song'

  const songStore = useSongStore()
  const userStore = useUserStore()
  const isShowLyric = ref(false)
  const isShowLyricPage = ref(false)
  const ap = ref()
  const index = ref(0)
  const isPlay = computed(() => songStore.getIsPlay)
  const visible = ref(false)
  const tableData = computed(() => songStore.getPlayList) as any
  const playData = computed(() => {
    return currentMode.value === 'sj' ? songStore.getShuffledPlayList : songStore.getPlayList
  }) as any
  const currentTime = ref(0)
  const totalDuration = ref(0)
  const songId = computed(() => songStore.getSongId)
  const mode = ['xd', 'lb', 'dq', 'sj', 'sx']
  const currentMode = computed(() => songStore.getCurrentMode)

  // 切换模式
  const changeMode = (index: number) => {
    // 非0（心动模式）时直接切换
    if (index) {
      songStore.setCurrentMode(mode[index])
    } else {
      // 是喜欢列表则可切换心动模式
      // 不是则跳过
      songStore.setCurrentMode(mode[1])
    }
    if (currentMode.value === 'sj') {
      const shuffleList = shuffle(songStore.getPlayList)
      songStore.setShuffledPlayList(shuffleList)
    }
    window.electronAPI.setTrayMenuStatus(isPlay.value, isShowLyric.value, currentMode.value)
  }
  // 创建歌词窗口
  const createWindow = () => {
    isShowLyric.value = !isShowLyric.value
    window.electronAPI.setTrayMenuStatus(isPlay.value, isShowLyric.value, currentMode.value)
    window.tools.createNewWindow('lyric')
  }
  // 关闭歌词窗口
  const close = () => {
    isShowLyric.value = !isShowLyric.value
    window.tools.newClose()
  }
  const showLyricBox = () => {
    isShowLyricPage.value = !isShowLyricPage.value
    var lyricBox = document.getElementById('lyricBox') as any
    var songInfo = document.getElementById('song-info') as any
    var songOperation = document.getElementById('song-operation') as any
    if (isShowLyricPage.value) {
      lyricBox.classList.add('active')
      songInfo.classList.add('up-or-down')
      songOperation.classList.add('up-or-down')
    } else {
      lyricBox.classList.remove('active')
      songInfo.classList.remove('up-or-down')
      songOperation.classList.remove('up-or-down')
    }
  }
  // 播放暂停
  const playAudio = (flag: boolean) => {
    flag ? ap.value?.play() : ap.value?.pause()
    songStore.setIsPlay(flag)
    window.electronAPI.setTrayMenuStatus(isPlay.value, isShowLyric.value, currentMode.value)
    window.electronAPI.setLrcWinData(isPlay.value, songStore.getSongId, JSON.stringify(songStore.getLrcArr))
  }
  // 切换到下一首音频
  const nextSong = () => {
    index.value = index.value === playData.value.length - 1 ? 0 : index.value + 1
    songStore.setSongId((playData.value[index.value] as any).id)
    if (isPlay.value) {
      playAudio(false)
    }
  }
  // 切换到上一首音频
  const previousSong = () => {
    index.value = index.value === 0 ? playData.value.length - 1 : index.value - 1
    songStore.setSongId((playData.value[index.value] as any).id)
    if (isPlay.value) {
      playAudio(false)
    }
  }
  // 切换到播放列表里的第几个音频
  const switchPlay = (index: number = 1) => {
    ap.value.list.switch(index)
  }
  // 跳转到特定时间，时间的单位为秒
  const seekPlay = (time: number = 1) => {
    ap.value.seek(time)
  }
  // 移除播放列表中的第几个音频
  const removePlay = (index: number = 1) => {
    ap.value.list.remove(index)
  }
  // 清空播放列表
  const clearPlay = () => {
    songStore.setPlayList([])
    ap.value.list.clear()
  }
  // 正在播放的列样式
  const setRowClass = (record: TableData, rowIndex: number) => {
    return record.raw.id == songStore.getSongId ? 'play-row' : ''
  }
  // 双击列表项
  const cellDblclick = (record: TableData) => {
    songStore.setSongId(record.id)
  }
  // 喜欢音乐
  const likeSong = (id: number, like: boolean) => {
    const params = { id, like }
    getLikeSong(params).then(res => {
      const { code } = res
      if (code === 200) {
        if (like) {
          const arr = [id, ...userStore.getLikeIdList]
          userStore.setLikeIdList(arr)
          Message.success('喜欢成功')
        } else {
          const arr = [...userStore.getLikeIdList]
          const index = arr.indexOf(id)
          if (index !== -1) {
            arr.splice(index, 1)
          }
          userStore.setLikeIdList(arr)
          Message.success('取消成功')
        }
      } else {
        Message.error('操作失败')
      }
    })
  }
  const isSwitch = ref(true)
  const styleElement = document.createElement('style')

  // 显示播放列表
  const setShowList = () => {
    visible.value = !visible.value
  }

  // 设置播放容器
  const setAPlayer = (play: boolean, audioArr?: any) => {
    ap.value = new APlayer({
      container: document.getElementById('aplayer'),
      loop: false,
      volume: 1,
      listFolded: true,
      theme: '#ec4141',
      audio: audioArr
    })
    // 在这里执行需要在 APlayer 实例加载完成后进行的操作
    ap.value.on('canplay', function () {
      totalDuration.value = ap.value.audio.duration
      currentTime.value = ap.value.audio.currentTime
      if (play) {
        if (!isPlay.value) {
          playAudio(true)
        } else {
          playAudio(false)
          playAudio(true)
        }
      }
    })

    // 当音频的元数据加载完成时触发
    ap.value.on('loadedmetadata', function () {
      // 首次打开恢复上次播放的时间
      if (isSwitch.value) {
        seekPlay(songStore.getCurrentTime)
        isSwitch.value = false
      }
    })

    // 在这里执行需要在 APlayer 实例暂停时进行的操作
    ap.value.on('pause', function () {})

    // 在这里执行需要在 APlayer 实例播放时进行的操作
    ap.value.on('play', function () {})

    // 当音频播放时间更新时触发，通常用于实时更新音频播放进度
    ap.value.on('timeupdate', function () {
      currentTime.value = ap.value.audio.currentTime
      songStore.setCurrentTime(ap.value.audio.currentTime)
      window.electronAPI.changeCurrentTime(isShowLyric.value, currentTime.value)
      window.electronAPI.setLrcWinData(isPlay.value, songStore.getSongId, JSON.stringify(songStore.getLrcArr))
      // 歌曲名超长滚动 不超长不滚动 每首歌只执行一次
      if (currentTime.value <= 0) {
        const textElement = document.querySelector('.text') as any
        const nameElement = document.querySelector('.footer-left-info-name') as any
        const parentWidth = nameElement.offsetWidth
        styleElement.innerHTML = `@keyframes scrollText {
          0% {
            transform: translateX(${parentWidth}px);
          }
          100% {
            transform: translateX(-100%);
          }
        }`
        document.head.appendChild(styleElement)

        if (textElement.offsetWidth > nameElement.offsetWidth) {
          nameElement.classList.add('scroll')
        } else {
          nameElement.classList.remove('scroll')
        }
      }
    })

    // 播放结束
    ap.value.on('ended', function () {
      songStore.setCurrentTime(0)
      // 判断循环、顺序、随机、单曲播放
      if (currentMode.value === 'dq') {
        // 单曲
        seekPlay(songStore.getCurrentTime)
        playAudio(true)
      } else if (currentMode.value === 'sx' && playData.value.length - 1 === index.value) {
        // 顺序播放结束不需要操作  如果是最后一条只需要将播放状态改为暂停样式
        playAudio(false)
      } else {
        ap.value.list.clear()
        index.value = index.value === playData.value.length - 1 ? 0 : index.value + 1
        songStore.setSongId(playData.value[index.value].id)
      }
    })
  }

  const info = ref({
    url: '',
    artist: '',
    cover: '',
    name: '',
    tns: ''
  })
  // 设置歌曲信息
  const setSongInfo = (autoPlay: boolean) => {
    if (!songId.value) {
      return
    }
    playData.value.forEach((item: any, i: number) => {
      if (item.id == songId.value && index.value != i) {
        if (isPlay.value) {
          playAudio(false)
        }
        index.value = i
      }
    })
    songStore.setCurrentIndex(index.value)
    info.value = {
      url: '',
      artist: playData.value[index.value].ar.map((item: any) => item.name).join(' / '),
      cover: playData.value[index.value].al.picUrl,
      name: playData.value[index.value].name,
      tns: playData.value[index.value].tns ? playData.value[index.value].tns[0] : ''
    }
    window.tools.songTitle(info.value.name + '-' + info.value.artist)
    const params = {
      id: songId.value,
      level: 'standard'
    }
    getSongUrl(params).then(res => {
      info.value.url = res.data[0].url
      // 有些没版权的 没有url 切换下一首
      if (info.value.url) {
        setAPlayer(autoPlay, [info.value])
      } else {
        nextSong()
      }
    })
    getGC()
  }
  // 获取歌词
  const getGC = () => {
    getLyric(songId.value).then(res => {
      const {
        code,
        lrc: { lyric }
      } = res
      if (code === 200) {
        const arr = formatLyric(lyric)
        songStore.setLrcArr(arr)
        window.electronAPI.setLrcWinData(isPlay.value, songStore.getSongId, JSON.stringify(songStore.getLrcArr))
      }
    })
  }
  // 更新了播放歌曲id
  watch(songId, () => {
    songStore.setCurrentTime(0)
    setSongInfo(true)
  })
  // 更新了播放状态  一般用于其他页面点击需要暂停音频
  watch(isPlay, () => {
    playAudio(isPlay.value)
  })
  onMounted(() => {
    setAPlayer(false, [])
    setSongInfo(false)
    window.electronAPI.lrcStatus((_event: any, message: boolean) => {
      isShowLyric.value = message || false
      window.electronAPI.setTrayMenuStatus(isPlay.value, isShowLyric.value, currentMode.value)
    })
    // 上一首下一首 播放暂停
    window.electronAPI.setPlaySong((_event: any, type: string) => {
      if (type === 'prev') {
        previousSong()
      } else if (type === 'next') {
        nextSong()
      } else if (type === 'toggle') {
        playAudio(!isPlay.value)
      }
    })

    window.electronAPI.getGoPage((_event: any, page: string) => {
      if (page === 'pageLyric') {
        isShowLyricPage.value = false
        showLyricBox()
      } else if (page === 'next') {
        nextSong()
      } else if (page === 'toggle') {
        playAudio(!isPlay.value)
      }
    })
  })
  onBeforeUnmount(() => {
    ap.value?.pause()
  })
</script>
<style scoped lang="less">
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    position: relative;
    overflow: hidden;
    background: #ffffff;
    &-left {
      flex: 1;
      height: 100%;
      position: relative;
      &-song-operation {
        position: absolute;
        top: -72px;
        height: 100%;
        display: flex;
        align-items: center;
        transition: top 0.5s ease;
        &.up-or-down {
          top: 0px;
        }
        .down {
          margin: 0 8px;
          width: 48px;
          height: 48px;
        }
        .circle {
          border-radius: 50%;
          box-sizing: border-box;
          border: 1px solid rgba(49, 49, 49, 0.3);
          width: 36px;
          height: 36px;
          color: rgba(0, 0, 0, 0.6);
          cursor: pointer;
        }
      }
      &-song-info {
        position: absolute;
        top: 0px;
        height: 100%;
        display: flex;
        align-items: center;
        transition: top 0.5s ease;
        &.up-or-down {
          top: 72px;
        }
      }
      &-pic {
        width: 48px;
        height: 48px;
        margin-left: 8px;
        border-radius: 6px;
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
        overflow: hidden;
        position: relative;
        img {
          width: 48px;
          height: 48px;
        }
        .up-mask {
          position: absolute;
          top: 0;
          width: 48px;
          height: 48px;
          display: none;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          background: rgba(107, 107, 107, 0.65);
        }
        &:hover .up-mask {
          display: flex;
        }
      }
      &-info {
        margin-left: 8px;
        .like-box {
          display: flex;
          align-items: center;
        }
        .like-icon {
          margin-left: 8px;
        }
        &-name {
          max-width: 160px;
          white-space: nowrap; /* 防止文本换行 */
          overflow: hidden; /* 隐藏超出部分 */
          .text {
            display: inline-block;
            white-space: nowrap; /* 防止文本换行 */
          }
          &.scroll {
            .text {
              animation: scrollText 5s linear infinite; /* 滚动动画 */
              animation-delay: 1s;
            }
          }
        }
      }
    }
    &-center {
      width: 460px;
      height: 100%;
      // background: rgb(195, 250, 173);
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      &-top {
        display: flex;
        align-items: center;
        margin-top: 8px;
        width: 200px;
        justify-content: space-between;
        .mode-icon {
          &:hover {
            color: #ec4141;
          }
        }
        .play-icon {
          font-size: 24px;
        }
        .play-icon-bg {
          background: #f5f5f5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
        }
      }
      &-bottom {
        width: 100%;
        position: absolute;
        bottom: 6px;
        display: flex;
        align-items: center;
        .start,
        .end {
          min-width: 36px;
          width: max-content;
          color: #999999;
        }
        :deep(.aplayer) {
          flex: 1;
          background: transparent;
          box-shadow: none;
          &-pic {
            display: none;
          }
          &-info {
            margin-left: 0;
            padding: 0;
            height: max-content;
            border-bottom: none;
          }
          &-music {
            display: none;
          }
          &-time {
            display: none;
            // width: 100%;
            // position: absolute;
          }
          .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar {
            height: 4px;
            .aplayer-played,
            .aplayer-loaded {
              height: 4px;
            }
          }
        }
      }
      .progress-bar {
        height: 10px;
        background-color: #ccc;
        cursor: pointer;
        &-fill {
          height: 100%;
          background-color: #007bff;
        }
      }
    }
    &-right {
      flex: 1;
      height: 100%;
      // background: rgb(154, 240, 235);
      &-operation {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: end;
        padding-right: 20px;
      }
    }
  }
  .list-box {
    position: absolute;
    z-index: 9999;
    top: 56px;
    right: 0;
    width: 420px;
    height: calc(100vh - 128px);
    background: #ffffff;
    padding: 12px;
    display: flex;
    flex-direction: column;
    &-top {
      border-bottom: 1px solid rgba(153, 153, 153, 0.3);
      height: 64px;
      &-title {
        font-size: 24px;
        font-weight: 700;
      }
      &-content {
        display: flex;
        justify-content: space-between;
      }
    }
    &-content {
      flex: 1;
      margin-right: -12px;
      overflow: auto;
    }
  }
  .lyric-box {
    position: fixed;
    z-index: 999;
    background: #ffffff;
    width: 100%;
    height: calc(100% - 72px);
    top: calc(100% - 72px);
    transition: top 0.5s ease;
  }
  .lyric-box.active {
    top: 0;
  }
</style>
