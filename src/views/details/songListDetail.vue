<template>
  <a-spin :loading="topLoading" tip="加载中...">
    <div class="detail-top">
      <div class="pic">
        <img :src="info.coverImgUrl" alt="" />
      </div>
      <div class="info">
        <div class="title noselect">
          <div class="tag">歌单</div>
          <div class="name">{{ info.name }}</div>
        </div>
        <div class="author-info noselect">
          <a-space>
            <div class="avatar">
              <img :src="info.avatarUrl" alt="" />
            </div>
            <span class="click-color">{{ info.nickname }}</span>
            <span class="gray">{{ formatTimestampToDate(info.createTime) }} 创建</span>
          </a-space>
        </div>
        <a-space class="operation-btn">
          <a-button type="primary" @click="cellDblclick(tableData[0])">
            <template #icon>
              <icon-caret-right />
            </template>
            <template #default>播放全部</template>
          </a-button>
          <a-button type="outline">
            <template #icon>
              <icon-star-fill />
            </template>
            <template #default>收藏({{ info.subscribedCount }})</template>
          </a-button>
          <a-button type="outline">
            <template #icon>
              <icon-share-internal />
            </template>
            <template #default>分享({{ info.shareCount }})</template>
          </a-button>
          <a-button type="outline">
            <template #icon>
              <icon-download />
            </template>
            <template #default>下载全部</template>
          </a-button>
        </a-space>
        <br />
        <a-space direction="vertical" :size="1">
          <div class="noselect" v-if="info.tags.length">
            标签：
            <template v-for="(item, i) in info.tags" :key="i">
              <template v-if="i !== 0"> /</template> <span class="click-color">{{ item }}</span>
            </template>
          </div>
          <a-space class="noselect">
            <div>
              歌曲：<span class="gray">{{ info.trackCount }} </span>
            </div>
            <div>
              播放：<span class="gray">{{ numFormat(info.playCount) }} </span>
            </div>
          </a-space>
          <span class="text-1">简介：{{ info.description || '这家伙很懒没有简介哦~' }} </span>
        </a-space>
      </div>
    </div>
  </a-spin>
  <div class="detail-bottom noselect">
    <a-table
      row-key="title"
      :scroll="{ x: '100%', y: '100%' }"
      :stripe="true"
      :pagination="false"
      :bordered="false"
      :data="tableData"
      :loading="loading"
      :row-class="setRowClass"
      @cell-dblclick="cellDblclick"
    >
      <template #columns>
        <a-table-column :width="60">
          <template #cell="{ record: { id }, rowIndex }">
            <icon-sound-fill v-if="id == songStore.getSongId" style="color: #ec4141" />
            <span v-else>{{ rowIndex < 9 ? '0' + (rowIndex + 1) : rowIndex + 1 }}</span>
          </template>
        </a-table-column>
        <a-table-column title="操作" ellipsis tooltip :width="80">
          <template #cell="{ record: { id, name, ar } }">
            <a-space>
              <icon-heart-fill v-if="userStore.getLikeIdList.includes(id)" style="color: #ec4141" class="cup" @click="likeSong(id, false)" :size="18" />
              <icon-heart v-else class="cup" @click="likeSong(id, true)" :size="18" />
              <icon-download class="cup" @click="downloadMusic(id, name, ar)" :size="18" />
            </a-space>
          </template>
        </a-table-column>
        <a-table-column title="标题" ellipsis tooltip data-index="name" cell-class="song-cell" :sortable="{ sortDirections: ['ascend', 'descend'] }">
          <template #cell="{ record: { name, tns, hr, sq, mv, fee } }">
            <span>{{ name }}</span> <span v-if="tns" class="color-grey">({{ tns[0] }})</span>
            <span class="table-tag" v-if="fee === 1">VIP</span>
            <span class="table-tag" v-if="hr">Hi-Res</span>
            <span class="table-tag" v-else-if="sq">SQ</span>
            <span class="table-tag" v-if="mv">
              <div>MV<icon-caret-right :size="8" /></div>
            </span>
          </template>
        </a-table-column>
        <a-table-column title="歌手" ellipsis tooltip :width="200" :sortable="{ sortDirections: ['ascend', 'descend'] }">
          <template #cell="{ record: { ar } }">
            <span v-for="(item, i) in ar" :key="i"> <span v-if="i !== 0">/</span>{{ item.name }}</span>
          </template>
        </a-table-column>
        <a-table-column title="专辑" ellipsis tooltip :width="120" :sortable="{ sortDirections: ['ascend', 'descend'] }">
          <template #cell="{ record: { al } }">
            <span>{{ al.name }}</span> <span v-if="al.tns.length" class="color-grey">({{ al.tns[0] }})</span>
          </template>
        </a-table-column>
        <a-table-column title="时间" ellipsis tooltip :width="82" :sortable="{ sortDirections: ['ascend', 'descend'] }">
          <template #cell="{ record: { dt } }">
            <span class="color-grey">{{ formatTime(dt / 1000) }}</span>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted, reactive, watch, computed } from 'vue'
  import { useSongStore, useUserStore } from '@/store'
  import { numFormat } from '@/util/index'
  import { formatTime, formatTimestampToDate } from '@/util/index'
  import { TableData } from '@arco-design/web-vue'
  import { getPlayTrackAll, getSongListDetail } from '@/api/find'
  import { useRoute } from 'vue-router'
  import useSongTable from '@/hooks/useSongTable'

  const route = useRoute()

  const info = reactive({
    name: '',
    coverImgUrl: '',
    avatarUrl: '',
    nickname: '',
    description: '',
    tags: [],
    type: 1,
    playCount: 0,
    trackCount: 0,
    userId: 0,
    createTime: 0,
    subscribedCount: 0,
    shareCount: 0,
    subscribed: false
  })
  const loading = ref(false)
  const topLoading = ref(false)
  const songStore = useSongStore()
  const userStore = useUserStore()
  const tableData = ref<TableData[]>([])
  const { setRowClass, downloadMusic, likeSong, cellDblclick } = useSongTable(tableData)
  const getList = () => {
    if (!songStore.getDetailSongId) {
      return
    }
    loading.value = true
    topLoading.value = true
    const params = {
      id: songStore.getDetailSongId
    }
    getPlayTrackAll(params).then((res: any) => {
      loading.value = false
      tableData.value = res.songs
      // 我喜欢的音乐进来的 更新喜欢id
      if (route.name === 'LikeList') {
        const arr = res.songs.map((item: any) => item.id)
        userStore.setLikeIdList(arr)
      }
    })
    // 歌单详情
    getSongListDetail(songStore.getDetailSongId).then((res: any) => {
      topLoading.value = false
      const { tags, coverImgUrl, name, creator, createTime, playCount, trackCount, shareCount, subscribed, subscribedCount, description } = res.playlist
      info.name = name
      info.tags = tags
      info.coverImgUrl = coverImgUrl
      info.avatarUrl = creator.avatarUrl
      info.nickname = creator.nickname
      info.userId = creator.userId
      info.description = description
      info.playCount = playCount
      info.trackCount = trackCount
      info.createTime = createTime
      info.subscribedCount = subscribedCount
      info.shareCount = shareCount
      info.subscribed = subscribed
    })
  }
  const songListId = computed(() => songStore.getDetailSongId)
  // 更新了歌单id
  watch(songListId, () => {
    getList()
  })
  onMounted(() => {
    getList()
  })
</script>
<style scoped lang="less">
  .detail-top {
    padding: 12px;
    display: flex;
    .pic img {
      width: 200px;
      height: 200px;
      border-radius: 10px;
      margin-right: 12px;
    }
    .info {
      .title {
        display: flex;
        align-items: center;
        .tag {
          border: 1px solid #ec4141;
          color: #ec4141;
          padding: 0 6px;
          font-size: 12px;
          margin-right: 12px;
        }
        .name {
          font-size: 24px;
          font-weight: 700;
        }
      }
      .author-info {
        display: flex;
        align-items: center;
        .avatar img {
          width: 28px;
          height: 28px;
          border-radius: 50%;
        }
      }
      .click-color {
        color: #0c73c2;
      }
      .operation-btn {
        margin-bottom: 12px;
        :deep(.arco-space-item) {
          .arco-btn {
            border-radius: 30px;
            .arco-btn-icon {
              font-size: 18px;
            }
          }
          .arco-btn-primary {
            background-color: #ec4141;
          }
          .arco-btn-outline {
            border-color: #cccccc;
            color: #4b4945;
          }
        }
      }
    }
  }
</style>
