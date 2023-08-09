export default {
  path: 'care',
  name: 'Care',
  component: () => import('@/views/care/index.vue'),
  meta: {
    title: '关注',
    requiresAuth: true,
    icon: 'icon-home',
    order: 0,
  }
}
