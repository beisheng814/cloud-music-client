export default {
  path: 'searchDetail',
  name: 'SearchDetail',
  component: () => import('@/views/searchDetail/index.vue'),
  meta: {
    title: '搜索详情',
    requiresAuth: true,
    icon: 'icon-search',
    order: 0,
  }
}
