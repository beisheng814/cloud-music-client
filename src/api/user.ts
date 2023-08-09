import { get } from '@/http'

// 获取账号信息
export function getUserAccount() {
  return get(`/user/account`)
}

// 获取用户详情
export function getUserDetail(params: { uid: number }) {
  return get(`/user/detail`, params)
}
// 获取用户信息 , 歌单，收藏，mv, dj 数量
export function getUserSubcount() {
  return get(`/user/subcount`)
}
/**
 *  喜欢音乐列表
 *  调用此接口 , 传入用户 id, 可获取已喜欢音乐 id 列表(id 数组)
 */
export function getLikeSongList(id: number | string) {
  return get(`/likelist?uid=${id}`)
}

export default {}
