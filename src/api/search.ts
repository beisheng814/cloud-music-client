import { get } from '@/http'

// 搜索  /search 或者 /cloudsearch(更全)
// 必选参数 : keywords : 关键词
// 可选参数 : limit : 返回数量 , 默认为 30 offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
// type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 2000:声音(搜索声音返回字段格式会不一样)
export function getSearch(params: { keywords: string; type?: number; limit?: number; offset?: number }) {
  return get(`/cloudsearch`, params)
}

// 默认搜索关键词   调用此接口 , 可获取默认搜索关键词
export function getSearchDefault() {
  return get(`/search/default`)
}

// 热搜列表(简略)   调用此接口,可获取热门搜索列表
export function getSearchHot() {
  return get(`/search/hot`)
}

// 热搜列表(详细)   调用此接口,可获取热门搜索列表
export function getSearchHotDetail() {
  return get(`/search/hot/detail`)
}

// 搜索建议   说明 : 调用此接口 , 传入搜索关键词可获得搜索建议 , 搜索结果同时包含单曲 , 歌手 , 歌单信息
export function getSearchSuggest(params: { keywords: string; type?: any }) {
  return get(`/search/suggest`, params)
}

// 搜索多重匹配   说明 : 调用此接口 , 传入搜索关键词可获得搜索结果
export function getSearchMultimatch(params: { keywords: string }) {
  return get(`/search/multimatch`, params)
}

export default {}
