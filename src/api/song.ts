import { get } from '@/http'

/**
 *  获取音乐 url - 新版
 *  传入的音乐 id( 可多个 , 用逗号隔开 ), 可以获取对应的音乐的 url,未登录状态或者非会员返回试听片段(返回字段包含被截取的正常歌曲的开始时间和结束时间)
 *  必选参数 : id : 音乐 id level: 播放音质等级, 分为 standard => 标准,higher => 较高, exhigh=>极高, lossless=>无损, hires=>Hi-Res, jyeffect => 高清环绕声, sky => 沉浸环绕声, jymaster => 超清母带
 */
export function getSongUrl(params: { id: number | string; level: string }) {
  return get(`/song/url/v1`, params)
}
/**
 *  喜欢音乐
 *  调用此接口 , 传入音乐 id, 可喜欢该音乐
 */
export function getLikeSong(params: { id: number | string; like?: boolean }) {
  return get(`/like`, params)
}

/**
 *  获取歌词
 *  说明 : 调用此接口 , 传入音乐 id 可获得对应音乐的歌词 ( 不需要登录 ) 必选参数 : id: 音乐 id
 */
export function getLyric(id: number | string) {
  return get(`/lyric?id=${id}`)
}
/**
 *  获取逐字歌词
 *  说明 : 此接口的 yrc 字段即为逐字歌词 (可能有歌曲不包含逐字歌词) 必选参数 : id: 音乐 id
 */
export function getLyricNew(id: number | string) {
  return get(`/lyric/new?id=${id}`)
}

/**
 *  获取客户端歌曲下载 url
 *  说明 : 使用 /song/url 接口获取的是歌曲试听 url, 但存在部分歌曲在非 VIP 账号上可以下载无损音质而不能试听无损音质, 使用此接口可使非 VIP 账号获取这些歌曲的无损音频
 *  必选参数 : id : 音乐 id (仅支持单首歌曲)
 *  可选参数 : br : 码率, 默认设置了 999000 即最大码率, 如果要 320k 则可设置为 320000, 其他类推
 */
export function getDownloadUrl(id: number | string) {
  return get(`/song/download/url?id=${id}`)
}
export default {}
