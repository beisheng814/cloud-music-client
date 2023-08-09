export default {
  path: 'podcast',
  name: 'Podcast',
  component: () => import('@/views/podcast/index.vue'),
  meta: {
    title: '播客',
    requiresAuth: true,
    icon: 'icon-home',
    order: 0,
  }
}
