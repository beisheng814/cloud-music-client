export default {
  path: 'find',
  name: 'Find',
  component: () => import('@/views/find/index.vue'),
  meta: {
    title: '首页',
    requiresAuth: true,
    icon: 'icon-home',
    order: 0,
  }
}
