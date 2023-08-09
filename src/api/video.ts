import { get } from '@/http'

/**
 *  获取视频标签列表
 *  说明 : 调用此接口 , 可获取视频标签列表
 */
export function getVideoGroupList() {
  return get(`/video/group/list`)
}
/**
 *  获取视频分类列表
 *  说明 : 调用此接口 , 可获取视频分类列表
 */
export function getVideoCategoryList() {
  return get(`/video/category/list`)
}
/**
 *  获取视频标签/分类下的视频
 *  说明 : 调用此接口 , 传入标签/分类id,可获取到相关的视频,分页参数只能传入 offset
 *  必选参数 : id: videoGroup 的 id
 *  可选参数 : offset: 默认 0
 */
export function getVideoGroup(params: { id: number; offset?: number }) {
  return get(`/video/group`, params)
}
/**
 *  获取全部视频列表
 *  说明 : 调用此接口,可获取视频分类列表,分页参数只能传入 offset
 */
export function getVideoAll(offset?: number | string) {
  return get(`/video/timeline/all`, { offset })
}
/**
 *  获取推荐视频
 *  说明 : 调用此接口, 可获取推荐视频,分页参数只能传入 offset
 */
export function getVideoRecommend(offset?: number | string) {
  return get(`/video/timeline/recommend`, { offset })
}
/**
 *  相关视频
 *  说明 : 调用此接口 , 可获取相关视频
 */
export function getVideoAllVideo(id?: number | string) {
  return get(`/related/allvideo`, { id })
}
/**
 *  视频详情
 *  说明 : 调用此接口 , 可获取视频详情
 */
export function getVideoDetail(id?: number | string) {
  return get(`/video/detail`, { id })
}
/**
 *  获取视频点赞转发评论数数据
 *  说明 : 调用此接口 , 传入 vid ( 视频 id ) , 可获取对应视频点赞转发评论数数据 必选参数 : vid: 视频 id
 */
export function getVideoDetailInfo(vid?: number | string) {
  return get(`/video/detail/info`, { vid })
}
/**
 *  获取视频播放地址
 *  说明 : 调用此接口 , 传入视频 id,可获取视频播放地址
 */
export function getVideoUrl(id?: number | string) {
  return get(`/video/url`, { id })
}

export default {}
