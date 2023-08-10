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
/**
 *  获取 mv 数据
 *  说明 : 调用此接口 , 传入 mvid ( 在搜索音乐的时候传 type=1004 获得 ) , 可获取对应 MV 数据 , 数据包含 mv 名字 , 歌手 , 发布时间 , mv 视频地址等数据 , 其中 mv 视频 网易做了防盗链处理 , 可能不能直接播放 , 需要播放的话需要调用 ' mv 地址' 接口
 */
export function getMvDetail(mvid?: number | string) {
  return get(`/mv/detail`, { mvid })
}
/**
 *  获取 mv 点赞转发评论数数据
 *  说明 : 调用此接口 , 传入 mvid ( 在搜索音乐的时候传 type=1004 获得 ) , 可获取对应 MV 点赞转发评论数数据
 */
export function getMvDetailInfo(mvid?: number | string) {
  return get(`/mv/detail/info`, { mvid })
}
/**
 *  mv 地址
 *  说明 : 调用此接口 , 传入 mv id,可获取 mv 播放地址
 */
export function getMvUrl(id?: number | string) {
  return get(`/mv/url`, { id })
}

export default {}
