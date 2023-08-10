<template>
  <a-table
    :scroll="{ x: '100%', y: '100%' }"
    :stripe="true"
    :bordered="false"
    :data="tableData"
    :loading="loading"
    :pagination="pagination"
    page-position="bottom"
    @page-change="onPageChange"
    :expanded-keys="expandedKeys"
    :default-expand-all-rows="true"
    row-key="id"
    :row-class="setRowClass"
    @cell-dblclick="cellDblclick"
  >
    <template #columns>
      <a-table-column :width="60">
        <template #cell="{ record: { id }, rowIndex }">
          <icon-sound-fill v-if="id == songStore.getSongId" style="color: #ec4141" />
          <span v-else>{{
            rowIndex + 1 + (pagination.current - 1) * pagination.pageSize < 9
              ? '0' + (rowIndex + 1)
              : rowIndex + 1 + (pagination.current - 1) * pagination.pageSize
          }}</span>
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
    <template #expand-row="{ record }">
      <div class="search-lyrics-row text-1" v-if="record.lyrics">歌词：<span v-for="item in record.lyrics" v-html="item" :style="{color: item.includes('<b>') ? '#ec4141' : ''}"></span></div>
    </template>
  </a-table>
</template>
<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { formatTime } from '@/util/index'
  import { TableData } from '@arco-design/web-vue'
  import useSongTable from '@/hooks/useSongTable'
  import useSearch from '@/hooks/useSearch'

  const tableData = ref<TableData[]>([])
  const expandedKeys = ref<number[]>([])
  const { userStore, songStore, setRowClass, downloadMusic, likeSong, cellDblclick } = useSongTable(tableData)
  const emit = defineEmits(['scrollTop', 'totalStr'])
  const props = defineProps({
    keywords: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      default: 1
    }
  })
  const { codes, results, loading, pagination, onPageChange, getTable } = useSearch(props)
  watch(results, () => {
    if (codes.value === 200) {
      emit('scrollTop')
      expandedKeys.value = []
      tableData.value = results.value.songs
      results.value.songs.forEach((item: TableData) => {
       if (item.lyrics) {
        expandedKeys.value.push(item.id)
       }})
      pagination.total = results.value.songCount
      emit('totalStr', `找到${results.value.songCount}首单曲`)
    }
  })
  onMounted(() => {
    getTable()
  })
</script>
<style lang="less" scoped>
.search-lyrics-row {
  margin-left: 60px;
}
</style>
