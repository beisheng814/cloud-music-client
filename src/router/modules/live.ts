export default {
  path: 'live',
  name: 'Live',
  component: () => import('@/views/live/index.vue'),
  meta: {
    title: '直播',
    requiresAuth: true,
    icon: 'icon-home',
    order: 0,
  }
}
