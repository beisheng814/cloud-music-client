import { get } from '@/http'

// 直接调用此接口, 可获取游客cookie,如果遇到其他接口未登录状态报400状态码需要验证的错误,可使用此接口获取游客cookie避免报错
export function getAnonimous() {
  return get(`/register/anonimous`)
}

// 二维码 key 生成接口
export function getKey() {
  return get(`/login/qr/key`)
}

// 二维码生成接口
export function getQrKey(params: { key: string,qrimg?: any }) {
  return get(`/login/qr/create`, params)
}

// 二维码检测扫码状态接口800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies),如扫码后返回502,则需加上noCookie参数,如&noCookie=true
export function getQrStatus(params: { key: string }) {
  return get(`/login/qr/check`, params)
}

// 退出登录
export function getLogout() {
  return get(`/logout`)
}

// 登录状态
export function getStatus() {
  return get(`/login/status`)
}
export default {}
