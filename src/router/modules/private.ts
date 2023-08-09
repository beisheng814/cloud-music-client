export default {
  path: 'private',
  name: 'Private',
  component: () => import('@/views/private/index.vue'),
  meta: {
    title: '私人漫游',
    requiresAuth: true,
    icon: 'icon-home',
    order: 0,
  }
}
