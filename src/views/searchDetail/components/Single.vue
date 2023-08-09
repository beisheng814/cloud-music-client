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
</template>
<script setup lang="ts">
  import { ref, onMounted, reactive, computed, watch } from 'vue'
  import { getSearch } from '@/api/search'
  import { useSongStore, useUserStore } from '@/store'
  import { formatTime } from '@/util/index'
  import { TableData } from '@arco-design/web-vue'
  import useSongTable from '@/hooks/useSongTable'

  const songStore = useSongStore()
  const userStore = useUserStore()
  const props = defineProps({
    keywords: {
      type: String,
      default: ''
    }
  })
  const tableData = ref<TableData[]>([])
  const pagination = reactive({
    current: 1,
    pageSize: 30,
    total: 0
  })
  const params = computed(() => {
    return {
      keywords: props.keywords,
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize
    }
  })
  const loading = ref(false)
  const { setRowClass, downloadMusic, likeSong, cellDblclick } = useSongTable(tableData)
  const getTable = () => {
    loading.value = true
    getSearch(params.value)
      .then(res => {
        const { code, result } = res
        if (code === 200) {
          tableData.value = result.songs
          pagination.total = result.songCount
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
  const onPageChange = (page: number) => {
    pagination.current = page
    getTable()
  }
  watch(
    () => props.keywords,
    () => {
      getTable()
    }
  )
  onMounted(() => {
    getTable()
  })
</script>
<style lang="less" scoped></style>
