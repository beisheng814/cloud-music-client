<template>
  <div class="menu noselect">
    <div class="right">
      <!-- <a-list>
        <a-list-item>test1</a-list-item>
        <a-list-item>Bytedance Technology Co., Ltd.</a-list-item>
        <a-list-item>Beijing Toutiao Technology Co., Ltd.</a-list-item>
      </a-list> -->
    </div>
    <div class="left">
      <div class="menu-item" @click="goPage('pageLyric')">
        <i class="iconfont icon-pengyou"></i> <span class="text-1">{{ data.song }}</span>
      </div>
      <div class="menu-item" @click="switchSongs('toggle')">
        <icon-pause :size="16" v-if="data.playStatus" /><icon-play-arrow :size="16" v-else />
        <span>{{ data.playStatus ? '暂停' : '播放' }}</span>
      </div>
      <div class="menu-item" @click="switchSongs('prev')"><i class="iconfont icon-shangyishoushangyige"></i> <span>上一首</span></div>
      <div class="menu-item" @click="switchSongs('next')"><i class="iconfont icon-xiayigexiayishou"></i> <span>下一首</span></div>
      <a-popover position="lt" class="noselect">
        <div class="menu-item">
          <i
            class="iconfont"
            :class="
              data.playMode === 'xd'
                ? 'icon-icon_xindong'
                : data.playMode === 'lb'
                ? 'icon-24gl-repeat2'
                : data.playMode === 'dq'
                ? 'icon-danquxunhuan'
                : data.playMode === 'sj'
                ? 'icon-24gl-shuffle'
                : 'icon-shunxubofang'
            "
          ></i>
          <span>{{ playModeObj[data.playMode] }}</span>
        </div>
        <template #content>
          <div class="second-menu">
            <div><i class="iconfont icon-icon_xindong"></i>心动模式</div>
            <icon-check style="color: #dd001b" v-if="data.playMode === 'xd'" />
          </div>
          <div class="second-menu">
            <div><i class="iconfont icon-24gl-repeat2"></i>列表循环</div>
            <icon-check style="color: #dd001b" v-if="data.playMode === 'lb'" />
          </div>
          <div class="second-menu">
            <div><i class="iconfont icon-danquxunhuan"></i>单曲循环</div>
            <icon-check style="color: #dd001b" v-if="data.playMode === 'dq'" />
          </div>
          <div class="second-menu">
            <div><i class="iconfont icon-24gl-shuffle"></i>随机播放</div>
            <icon-check style="color: #dd001b" v-if="data.playMode === 'sj'" />
          </div>
          <div class="second-menu">
            <div><i class="iconfont icon-shunxubofang"></i>顺序播放</div>
            <icon-check style="color: #dd001b" v-if="data.playMode === 'sx'" />
          </div>
        </template>
      </a-popover>
      <a-popover position="lt" class="noselect">
        <div class="menu-item">
          <i class="iconfont" :class="data.winMode === 'wz' ? 'icon-20putongmoshi' : data.winMode === 'mn' ? 'icon-quanping1' : 'icon-window-minimize'"></i>
          <span>{{ winModeObj[data.winMode] }}</span>
        </div>
        <template #content>
          <div class="second-menu">
            <div><i class="iconfont icon-20putongmoshi"></i>完整模式</div>
            <icon-check style="color: #dd001b" v-if="data.winMode === 'wz'" />
          </div>
          <div class="second-menu">
            <div><i class="iconfont icon-quanping1"></i>mini模式</div>
            <icon-check style="color: #dd001b" v-if="data.winMode === 'mn'" />
          </div>
          <div class="second-menu">
            <div><i class="iconfont icon-window-minimize"></i>最小化</div>
            <icon-check style="color: #dd001b" v-if="data.winMode === 'zx'" />
          </div>
        </template>
      </a-popover>
      <div class="menu-item" @click="toggleLrcShow">
        <i class="iconfont icon-dakai"></i> <span>{{ data.desktopLrc ? '关闭' : '打开' }}桌面歌词</span>
      </div>
      <div class="menu-item"><icon-lock :size="16" /> <span>锁定桌面歌词</span></div>
      <div class="menu-item"><icon-settings :size="16" /> <span>设置</span></div>
      <div class="menu-item" @click="outWindow"><icon-export :size="16" /> <span>退出</span></div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { reactive, onMounted } from 'vue'
  const data = reactive({
    song: '未知',
    playStatus: true,
    playMode: 'xd',
    winMode: 'wz',
    desktopLrc: false,
    locking: false
  })
  type MyObject = {
    [key: string]: string // 添加索引签名，允许接受类型为 "string" 的参数作为索引
  }
  const playModeObj: MyObject = {
    xd: '心动模式',
    lb: '列表循环',
    dq: '单曲循环',
    sj: '随机播放',
    sx: '顺序播放'
  }
  const winModeObj: MyObject = {
    wz: '完整模式',
    mn: 'mini模式',
    zx: '最小化'
  }

  const goPage = (page: string) => {
    console.log(page)
    window.electronAPI.setGoPage(page)
  }
  const switchSongs = (type: string) => {
    window.electronAPI.switchSongs(type)
  }
  const outWindow = () => {
    window.tools.close()
  }
  const toggleLrcShow = () => {
    data.desktopLrc = !data.desktopLrc
    window.electronAPI.toggleLrcShow(data.desktopLrc)
  }
  onMounted(() => {
    window.electronAPI.setTrayMenuTitle((_event: any, title: string) => {
      data.song = title
    })
    window.electronAPI.getTrayMenuStatus((_event: any, isPlay: boolean, desktopLrc: boolean, mode: string) => {
      data.playStatus = isPlay
      data.desktopLrc = desktopLrc
      data.playMode = mode
    })
  })
</script>
<style lang="less" scoped>
  .menu {
    width: 100%;
    height: 100%;
    display: flex;
    // .right,
    .left {
      border-radius: 4px;
      background: #ffffff;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
    }
    .right {
      width: 200px;
    }
    .left {
      flex: 1;
      margin-right: 2px;
    }
    &-item {
      box-sizing: border-box;
      height: 40px;
      padding-left: 12px;
      line-height: 38px;
      display: flex;
      align-items: center;
      span {
        margin-left: 12px;
      }
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }

    :deep(.arco-list-content) {
      .arco-list-item {
        padding: 8px;
      }
    }
  }
  .second-menu {
    width: 140px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
      display: flex;
      align-items: center;
      i {
        margin-right: 10px;
      }
    }
    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>
