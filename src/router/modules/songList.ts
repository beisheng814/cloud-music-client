export default {
  path: 'songList',
  name: 'SongList',
  component: () => import('@/views/details/songListDetail.vue'),
  meta: {
    title: '歌单详情',
    requiresAuth: true,
    icon: 'icon-home',
    order: 0
  }
}
