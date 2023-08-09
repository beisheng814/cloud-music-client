export default {
  path: 'video',
  name: 'Video',
  component: () => import('@/views/video/index.vue'),
  meta: {
    title: '视频',
    requiresAuth: true,
    icon: 'icon-home',
    order: 0,
  }
}
