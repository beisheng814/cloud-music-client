import { get } from '@/http'

// banner  0: pc  1: android  2: iphone  3: ipad
export function getBanner() {
  return get(`/banner?type=0`)
}
//获取推荐歌单P
export function getPersonalized() {
  return get(`personalized?limit=10`)
}

// 获得每日推荐歌单 ( 需要登录 )
export function getResource() {
  return get(`/recommend/resource`)
}

/***
  歌单 ( 网友精选碟 )
  order: 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
  cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
  limit: 取出歌单数量 , 默认为 50
  offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
 */
export function playlist(params: { order?: string; cat?: string; limit?: number; offset?: number }) {
  return get(`/top/playlist`, params)
}

/***
 * 获取歌单所有歌曲
 * 必选参数 : id : 歌单 id
 * 可选参数 : limit : 限制获取歌曲的数量，默认值为当前歌单的歌曲数量
 * 可选参数 : offset : 默认值为0
 * 
 * 注：关于offset，你可以这样理解，假设你当前的歌单有200首歌
 * 你传入limit=50&offset=0等价于limit=50，你会得到第1-50首歌曲
 * 你传入limit=50&offset=50，你会得到第51-100首歌曲
 * 如果你设置limit=50&offset=100，你就会得到第101-150首歌曲
 */
export function getPlayTrackAll(params: any) {
  return get(`/playlist/track/all`, params)
}

/***
 * 歌单详情详情
 * 说明 : 调用后可获取歌单详情动态部分,如评论数,是否收藏,播放数
 */
 export function getSongListDetail(id: number) {
  return get(`/playlist/detail?id=${id}`)
}

/***
 * 歌单详情动态
 * 说明 : 调用后可获取歌单详情动态部分,如评论数,是否收藏,播放数
 */
export function getSongListDetailInfo(id: number) {
  return get(`/playlist/detail/dynamic?id=${id}`)
}
export default {}
