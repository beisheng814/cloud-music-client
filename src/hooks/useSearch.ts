import { computed, reactive, ref, watch } from 'vue'
import { getSearch } from '@/api/search'

export default function useSearch(props: { keywords: string; type: number }) {
  const loading = ref(false)
  const codes = ref(0)
  const results = ref()
  const pagination = reactive({
    current: 1,
    pageSize: 30,
    total: 0
  })
  const params = computed(() => {
    return {
      type: props.type,
      keywords: props.keywords,
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize
    }
  })
  const getTable = async () => {
    loading.value = true
    await getSearch(params.value)
      .then(res => {
        const { code, result } = res
        codes.value = code
        results.value = result
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
  return {
    codes,
    results,
    loading,
    pagination,
    onPageChange,
    getTable
  }
}
