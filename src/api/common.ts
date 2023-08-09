import { get } from '@/http'

export interface commentParamsType {
  id: number | string
  type: number
  pageNo?: number
  pageSize?: number
  sortType?: number
  cursor?: number | string
}
/**
 * 新版评论接口
 * 说明 : 调用此接口 , 传入资源类型和资源 id,以及排序方式,可获取对应资源的评论
 * 必选参数 :
 * id : 资源 id, 如歌曲 id,mv id
 * type: 数字 , 资源类型 , 对应歌曲 , mv, 专辑 , 歌单 , 电台, 视频对应以下类型
 *
 * 0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台节目 5: 视频 6: 动态 7: 电台
 *
 * 可选参数 :
 * pageNo:分页参数,第 N 页,默认为 1
 * pageSize:分页参数,每页多少条数据,默认 20
 * sortType: 排序方式, 1:按推荐排序, 2:按热度排序, 3:按时间排序
 * cursor: 当sortType为 3 时且页数不是第一页时需传入,值为上一条数据的 time
 *
 * @param {commentParamsType} params - 参数
 * @returns
 */
export function getComment(params: commentParamsType) {
  return get(`/comment/new`, params)
}

export interface commentFloorHotParamsType {
  id: number | string
  type: number
  parentCommentId?: number | string
  limit?: number
  time?: number
  before?: number
}
/**
 * 楼层评论
 * @param {commentFloorHotParamsType} params - 参数
 * 必选参数 :
 * parentCommentId - 楼层评论 id
 * id - 资源 id
 * type - 数字 , 资源类型 , 对应歌曲 , mv, 专辑 , 歌单 , 电台, 视频对应以下类型
 * 0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台节目 5: 视频 6: 动态 7: 电台
 *
 * 可选参数 : limit: 取出评论数量 , 默认为 20  time: 分页参数,取上一页最后一项的 time 获取下一页数据
 * @returns
 */
export function getCommentFloor(params: commentFloorHotParamsType) {
  return get(`/comment/floor`, params)
}
/**
 * 热门评论
 * @param {commentFloorHotParamsType} params - 参数
 * 必选参数 :
 * id - 资源 id
 * type - 数字 , 资源类型 , 对应歌曲 , mv, 专辑 , 歌单 , 电台, 视频对应以下类型
 * 0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台节目 5: 视频 6: 动态 7: 电台
 *
 * 可选参数 : limit: 取出评论数量 , 默认为 20  offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值 before: 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过 5000 条评论的时候需要用到)
 * @returns
 */
export function getCommentHot(params: commentFloorHotParamsType) {
  return get(`/comment/Hot`, params)
}

/**
 * 给评论点赞
 * 说明 : 调用此接口 , 传入 type, 资源 id, 和评论 id cid 和 是否点赞参数 t 即可给对 应评论点赞 ( 需要登录 )
 * 必选参数 :
 * id : 资源 id, 如歌曲 id,mv id
 * cid : 评论 id
 * t : 是否点赞 , 1 为点赞 ,0 为取消点赞
 * type: 数字 , 资源类型 , 对应歌曲 , mv, 专辑 , 歌单 , 电台, 视频对应以下类型
 * 0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台节目 5: 视频 6: 动态 7: 电台
 *  动态点赞不需要传入 id 参数，需要传入动态的 threadId 参数,如：/comment/like?type=6&cid=1419532712&threadId=A_EV_2_6559519868_32953014&t=0， threadId 可通过 /event，/user/event 接口获取
 */
export function getCommentLike(params: { id: number | string; cid: number | string; t: number; type: number; threadId: string }) {
  return get(`/comment/like`, params)
}
export default {}
