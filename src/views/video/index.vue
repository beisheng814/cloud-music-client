<template>
  <div class="video-box noselect">
    <div class="tabs">
      <a-space :size="24">
        <div class="tabs-item" :class="tabName === 'video' ? 'tabs-active' : ''" @click="changeTab('video')">视频</div>
        <div class="tabs-item" :class="tabName === 'mv' ? 'tabs-active' : ''" @click="changeTab('mv')">MV</div>
      </a-space>
    </div>
    <div v-if="tabName === 'video'" class="content video" @scroll="handleScroll">
      <div class="video-top">
        <div class="video-top-left">
          <a-trigger v-model:popup-visible="visible" trigger="click" class="search-trigger" :popup-translate="[250, 10]">
            <div class="tag">{{ currentTag }} <icon-right /></div>
            <template #content>
              <div class="tag-select">
                <div class="tag-select-top">
                  <div class="classify-tag cup" :class="tagId === 0 ? 'current-tag' : ''" @click="updatedCurrentTag(0, '全部视频')">全部视频</div>
                </div>
                <div class="tag-select-content">
                  <a-space wrap :size="12">
                    <div
                      v-for="item in tagsList"
                      :key="item.id"
                      class="classify-tag cup"
                      :class="tagId === item.id ? 'current-tag' : ''"
                      @click="updatedCurrentTag(item.id, item.name)"
                    >
                      {{ item.name }}
                    </div>
                  </a-space>
                </div>
              </div>
            </template>
          </a-trigger>
        </div>
        <div class="video-top-right">
          <a-space :size="8">
            <div
              v-for="item in hotTagsList"
              :key="item.id"
              class="hot-tag-item cup"
              :class="tagId === item.id ? 'current-tag' : ''"
              @click="updatedCurrentTag(item.id, item.name)"
            >
              {{ item.name }}
            </div>
          </a-space>
        </div>
      </div>
      <div class="video-content">
        <template v-for="(item, i) in videoData" :key="item.vid + i">
          <VideoItem :data="item" class="cup" @click="goVideoDetail(item, 5)" />
        </template>
      </div>
      <div class="loading" ref="loadingRef" v-if="loading">
        <a-space :size="8"><icon-loading />加载中...</a-space>
      </div>
    </div>
    <div v-else class="mv">mv</div>
  </div>
  <VideoDetailModel ref="videoDetailRef" />
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, computed } from 'vue'
  import VideoItem from '@/components/VideoItem.vue'
  import VideoDetailModel from '@/views/details/videoDetailModel.vue'
  import { getVideoAll, getVideoCategoryList, getVideoGroup, getVideoGroupList } from '@/api/video'
  import { useRouter } from 'vue-router'
  import { useSongStore } from '@/store'

  const songStore = useSongStore()
  const router = useRouter()
  const videoDetailRef = ref()
  interface tagsListType {
    id: number
    name: string
  }
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
  const tabName = ref('video')
  const visible = ref(false)
  // 是否请求第二次
  const isSecond = ref(0)
  const loadingRef = ref()
  const loading = ref(false)
  const videoData = ref<videoDataItem[]>([])
  const currentTag = ref('全部视频')
  const tagId = ref<number>(0)
  const offset = ref<number>(0)
  const tagsList = ref<tagsListType[]>([])
  const hotTagsList = ref<tagsListType[]>([])
  const params = computed(() => {
    return {
      id: tagId.value,
      offset: offset.value
    }
  })
  const goVideoDetail = (item: videoDataItem, type: number) => {
    // 将播放音乐状态设置为暂停
    songStore.setIsPlay(false)
    // router.push({ name: 'VideoDetail', query: { data: JSON.stringify(item) } })
    videoDetailRef.value.show(item, type)
  }
  const handleScroll = () => {
    const myElement: any = document.querySelector('.video')
    // 判断是否滚动到底部
    if (myElement.scrollHeight - parseInt(myElement.scrollTop) == myElement.clientHeight) {
      // 执行触底加载的操作
      console.log('执行触底加载的操作')
      if (tagId.value && !loading.value) {
        getVideoGroupData()
      }
    }
  }
  const updatedCurrentTag = (id: number, name: string) => {
    tagId.value = id
    currentTag.value = name
  }
  const changeTab = (val: string) => {
    tabName.value = val
  }
  const getTagsList = () => {
    getVideoGroupList().then(res => {
      const { code, data } = res
      if (code === 200) {
        tagsList.value = data
      }
    })
    getVideoCategoryList().then(res => {
      const { code, data } = res
      if (code === 200) {
        hotTagsList.value = data
      }
    })
  }
  const getVideoData = () => {
    loading.value = true
    if (!tagId.value) {
      getVideoAll()
        .then(res => {
          const { code, datas } = res
          if (code === 200) {
            videoData.value = datas.map((item: any) => {
              return item.data
            })
          }
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      getVideoGroupData()
    }
  }
  const getVideoGroupData = () => {
    loading.value = true
    getVideoGroup(params.value)
      .then(res => {
        const { code, datas } = res
        if (code === 200) {
          offset.value = offset.value + 8
          const arr = datas.map((item: any) => {
            return item.data
          })
          // 因为没有总条数返回 判断当前页面的最后一个vid与请求回来的最后一个vid相同则上次为最后一页数据
          if (videoData.value.length && videoData.value[videoData.value.length - 1].vid === arr[arr.length - 1].vid) {
            return
          }
          // 切换了标签 需请求三次数据占满屏幕 正常一次8条 有些数据一次只能有5条所以三次 确保出现滚动条
          if (isSecond.value < 2) {
            getVideoGroupData()
            isSecond.value += 1
          }
          videoData.value = [...videoData.value, ...arr]
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
  watch(tagId, () => {
    visible.value = false
    isSecond.value = 0
    offset.value = 0
    videoData.value = []
    getVideoData()
  })
  onMounted(() => {
    getVideoData()
    getTagsList()
  })
</script>

<style lang="less" scoped>
  .loading {
    text-align: center;
  }
  .current-tag {
    background: rgba(236, 65, 65, 0.1);
    border-radius: 20px;
    color: rgba(236, 65, 65, 1);
  }
  .tag-select {
    width: 600px;
    height: 400px;
    overflow: auto;
    padding: 12px;
    .classify-tag {
      width: 100px;
      text-align: center;
      padding: 4px 0;
      font-size: 12px;
    }
    &-top {
      padding-bottom: 8px;
      margin-bottom: 12px;
      border-bottom: 1px solid rgba(153, 153, 153, 0.3);
    }
  }
  .video-box {
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    .tabs {
      padding: 0 24px;
      padding-top: 24px;
      height: 72px;
      &-item {
        padding-bottom: 4px;
        cursor: pointer;
      }
      &-active {
        font-weight: 700;
        font-size: 16px;
        border-bottom: 2px solid #ec4141;
      }
    }
    .content {
      padding: 0 24px;
      padding-bottom: 24px;
      height: calc(100% - 72px);
      overflow: auto;
    }
    .video {
      &-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        &-left {
          .tag {
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #999;
            width: 100px;
            padding: 2px;
            border-radius: 20px;
          }
        }
        &-right {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.7);
          .hot-tag-item {
            padding: 0 8px;
          }
        }
      }
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
  }
</style>
