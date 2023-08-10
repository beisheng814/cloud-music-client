<template>
  <a-spin :loading="loading" tip="加载中...">
    <div class="singer" v-for="item in singerData" :key="item.id">
      <div class="singer-left">
        <img class="singer-avatar" :src="item.img1v1Url" alt="" />
        <div class="singer-name">{{ item.name }} <span v-if="item.trans || item.alias && item.alias.length" class="gray">({{ item.trans || item.alias[0] }})</span></div>
      </div>
      <div class="singer-right"></div>
    </div>
    <div class="pagination" v-if="pagination.total > 30">
      <a-pagination :total="pagination.total" @change="onPageChange" />
    </div>
  </a-spin>
</template>
<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import useSearch from '@/hooks/useSearch'

  const singerData = ref<any[]>([])
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
      singerData.value = results.value.artists
      pagination.total = results.value.artistCount
      emit('totalStr', `找到${results.value.artistCount}个歌手`)
    }
  })
  onMounted(() => {
    getTable()
  })
</script>
<style scoped lang="less">
.arco-spin {
    width: 100%;
  }
  .singer {
    padding: 12px 0;
    &:nth-child(odd) {
      background: rgba(245, 245, 245, 0.5);
    }
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
    &-left {
      display: flex;
      align-items: center;
      .singer-avatar {
        margin-right: 10px;
        width: 72px;
        height: 72px;
        border-radius: 12px;
        overflow: hidden;
      }
    }
  }
  .pagination {
    width: max-content;
    margin: 0 auto;
    margin-top: 20px;
  }
</style>
