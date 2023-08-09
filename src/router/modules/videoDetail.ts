// 使用路由跳转有问题 返回回去数据会重新加载未记录位置 暂时弃用 
export default {
  path: 'videoDetail1',
  name: 'VideoDetail1',
  component: () => import('@/views/details/videoDetail.vue'),
  meta: {
    title: '歌单详情',
    requiresAuth: true,
    icon: 'icon-home',
    order: 0
  }
}
