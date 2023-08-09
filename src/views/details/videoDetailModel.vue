<template>
  <a-modal
    v-model:visible="visible"
    class="video-detail-modal"
    unmount-on-close
    :alignCenter="false"
    :mask="false"
    simple
    @close="handleCancel"
    :footer="false"
  >
    <div class="video-detail" v-show="!excitingAll">
      <div class="left">
        <a-space class="left-top cup" @click="handleCancel"><icon-left />视频详情</a-space>
        <div class="left-content">
          <vue3videoPlay :src="videoUrl" width="640px" :muted="false" height="410px" volume="0.7" color="#ec4141" />
          <div class="creator-info flex-between">
            <a-space>
              <a-avatar>
                <img alt="avatar" :src="data.creator.avatarUrl" />
              </a-avatar>
              <span>{{ data.creator.nickname }}</span>
            </a-space>
            <div class="gz-btn">+ 关注</div>
          </div>
          <div class="video-info">
            <div class="title">
              {{ data.description }}
            </div>
            <div class="tip">
              <a-space>
                <!-- <span class="gray">发布: {{ formatDate(data.creator.birthday) }}</span> -->
                <span class="gray">播放：{{ numFormat(data.playTime) }} </span>
              </a-space>
            </div>
            <div class="video-tag">
              <a-space>
                <a-tag v-for="item in data.videoGroup" :key="item.id">{{ item.name }}</a-tag>
              </a-space>
            </div>
            <div class="data-info">
              <a-space>
                <a-button type="outline">
                  <template #icon>
                    <icon-thumb-up-fill />
                  </template>
                  <template #default>赞({{ videoDataInfo.likedCount }})</template>
                </a-button>
                <!-- <a-button type="outline">
                  <template #icon>
                    <icon-star-fill />
                  </template>
                  <template #default>收藏({{ videoDataInfo.likedCount }})</template>
                </a-button> -->
                <a-button type="outline">
                  <template #icon>
                    <icon-share-internal />
                  </template>
                  <template #default>分享({{ videoDataInfo.shareCount }})</template>
                </a-button>
              </a-space>
            </div>
          </div>
          <div class="comments-box">
            <div class="comments-box-title"><span>评论</span>({{ commentsData.totalCount }})</div>
            <div class="exciting-comments">
              <div class="exciting-comments-title">精彩评论</div>
              <template v-for="item in commentsData.comments.slice(0, 10)" :key="item.commentId">
                <CommentsItem :data="item" />
                <a-divider margin="12px" />
              </template>
              <div class="more-btn">
                <a-button type="outline" @click="excitingAll = true">更多精彩评论 <icon-double-right /></a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">相关音乐</div>
    </div>
    <div class="exciting-comments-box" v-if="excitingAll">
      <div class="exciting-comments-box-title cup" @click="excitingAll = false"><icon-left />精彩评论</div>
      <template v-for="item in commentsData.comments" :key="item.commentId">
        <CommentsItem :data="item" />
        <a-divider margin="12px" />
      </template>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { numFormat } from '@/util/index'
  import { getVideoDetailInfo, getVideoUrl } from '@/api/video'
  import vue3videoPlay from 'vue3-video-play' // 引入组件
  import 'vue3-video-play/dist/style.css'
  import { getComment } from '@/api/common'
  import CommentsItem from '@/components/CommentsItem.vue'

  const visible = ref(false)
  const excitingAll = ref(false)
  const data = ref<any>()
  const type = ref(0)
  const vid = ref('')
  const videoUrl = ref('')
  const pagParams = reactive({
    id: '' || 0,
    type: 0,
    pageNo: 1,
    pageSize: 20,
    sortType: 3
  })
  interface Item {
    [key: string]: any // 使用索引签名表示未知个数的属性和属性值
  }
  const commentsData = reactive({
    comments: <Item>[],
    sortTypeList: [],
    totalCount: 0,
    sortType: 0
  })
  const allCommentsData = reactive({
    comments: <Item>[],
    sortTypeList: [],
    totalCount: 0,
    sortType: 0
  })
  const videoDataInfo = reactive({
    commentCount: 0,
    liked: false,
    likedCount: 0,
    shareCount: 0
  })
  const getVideo = () => {
    getVideoUrl(vid.value).then(res => {
      const { code, urls } = res
      if (code === 200) {
        videoUrl.value = urls[0].url
      }
    })
    getVideoDetailInfo(vid.value).then(res => {
      const { code, commentCount, liked, likedCount, shareCount } = res
      if (code === 200) {
        ;(videoDataInfo.commentCount = commentCount),
          (videoDataInfo.liked = liked),
          (videoDataInfo.likedCount = likedCount),
          (videoDataInfo.shareCount = shareCount)
      }
    })
  }
  const handleCancel = () => {
    visible.value = false
    videoUrl.value = ''
  }
  const show = (item: any, t: number) => {
    data.value = item
    type.value = t
    vid.value = item.vid
    pagParams.id = item.vid
    pagParams.type = t
    getVideo()
    const params = {
      id: item.vid,
      type: type.value
    }
    getComment(params).then(res => {
      const { code, data } = res
      if (code === 200) {
        commentsData.comments = data.comments
        commentsData.sortTypeList = data.sortTypeList
        commentsData.totalCount = data.totalCount
        commentsData.sortType = data.sortType
      }
    })
    visible.value = true
    pageComment()
  }
  const pageComment = () => {
    getComment(pagParams).then(res => {
      const { code, data } = res
      if (code === 200) {
        allCommentsData.comments = data.comments
        allCommentsData.sortTypeList = data.sortTypeList
        allCommentsData.totalCount = data.totalCount
        allCommentsData.sortType = data.sortType
      }
    })
  }
  defineExpose({ show })
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
      &-top {
        font-size: 16px;
        margin-bottom: 12px;
      }
      &-content {
        .creator-info {
          margin: 12px 0;
          .gz-btn {
            padding: 4px 16px;
            color: rgba(236, 65, 65, 1);
            background: rgba(236, 65, 65, 0.1);
            border-radius: 20px;
          }
        }
        .video-info {
          .title {
            font-size: 24px;
            font-weight: 700;
          }
          .tip {
            margin: 8px 0;
          }
          .data-info {
            margin-top: 24px;

            :deep(.arco-space-item) {
              .arco-btn-outline {
                border-radius: 20px;
                border-color: #cccccc;
                color: #4b4945;
              }
            }
          }
        }
        .comments-box {
          &-title {
            span {
              font-size: 18px;
              font-weight: 700;
            }
          }
          .exciting-comments {
            &-title {
              margin: 12px 0;
            }
            .more-btn {
              text-align: center;
              .arco-btn-outline {
                border-radius: 20px;
              }
            }
          }
        }
      }
    }
  }
  .exciting-comments-box {
    width: 1000px;
    height: calc(100% - 56px);
    overflow: auto;
    margin: 0 auto;
    padding: 24px;
    background: #ffffff;
    top: 0;
    &-title {
      font-weight: 700;
      font-size: 18px;
      margin-bottom: 24px;
    }
  }
</style>
