import axios, { AxiosRequestConfig, AxiosResponse, RS } from 'axios'
import qs from 'qs'
import { useRouter } from 'vue-router'
import { useUserStore } from "@/store";
import { Message } from '@arco-design/web-vue';

const CONTENT_TYPE = 'Content-Type'

enum ContentTypeEnum {
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  APPLICATION_JSON = 'application/json;charset=UTF-8',
  EXT_PLAIN = 'text/plain;charset=UTF-8'
}
const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10 * 60 * 1000
})

instance.interceptors.request.use(
  config => {
    if (!config.headers[CONTENT_TYPE]) {
      config.headers[CONTENT_TYPE] = ContentTypeEnum.APPLICATION_JSON
    }
    if (config.headers[CONTENT_TYPE] === ContentTypeEnum.FORM_URLENCODED) {
      config.params = qs.stringify(config.data)
    }
    return config
  },
  error => {
    return Promise.reject(error.response)
  }
)

instance.interceptors.response.use(
  (response: AxiosResponse<RS>): AxiosResponse<RS> => {
    const { status, data } = response
    const { msg, code } = data
    if (status === 200) {
      if ([401].includes(code)) {
        const router = useRouter()

        router.push({ name: 'Login' })
      }
      return response
    }
    throw new Error(msg || '请求失败，未知异常')
  },
  error => {
    Message.error('网络错误或登录后再试')
    return Promise.reject(new Error(error.message || '服务器异常，请稍后重试…'))
  }
)

class CAxios {
  static async get<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<RS<T>> {
    const userStore = useUserStore()
    const ad = {
      cookie: encodeURIComponent(userStore.getCookie),
      timestamp: Date.now()
    }
    const params = Object.assign(data || {}, ad)
    const response = await instance.get<RS<T>>(url, { ...config, params })
    return response.data
  }

  static async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<RS<T>> {
    const response = await instance.post<RS<T>>(url, data, config)

    // if ([0, 418].includes(response.data.err_no)) {
    return response.data
    // }
    throw new Error(response.data.msg)
  }

  static async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<RS<T>> {
    const response = await instance.put<RS<T>>(url, data, config)
    // if ([0, 418].includes(response.data.err_no)) {
    return response.data
    // }
    throw new Error(response.data.msg)
  }

  static async patch<T>(url: string, data?: Record<string, string>, config?: AxiosRequestConfig): Promise<RS<T>> {
    const response = await instance.patch<RS<T>>(url, data, config)
    // if ([0, 418].includes(response.data.err_no)) {
    return response.data
    // }
    throw new Error(response.data.msg)
  }

  static async delete<T>(url: string, data?: Record<string, string>, config?: AxiosRequestConfig): Promise<RS<T>> {
    !config && (config = { data: {} })
    data && (config.data = data)
    const response = await instance.delete<RS<T>>(url, config)
    // if ([0, 418].includes(response.data.err_no)) {
    return response.data
    // }
    throw new Error(response.data.msg)
  }

  static async downloadG<T = any>(url: string, data?: Record<string, string>, config?: AxiosRequestConfig): Promise<RS<T>> {
    const params = Object.assign(data || {}, {})
    const response = await instance.get<RS<T>>(url, { ...config, params, responseType: 'blob' })
    return response.data
  }

  static async downloadP<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<RS<T>> {
    const response = await instance.post<RS<T>>(url, data, { ...config, responseType: 'blob' })
    return response.data
  }
}

export const { get, post, put, patch, delete: remove, downloadG, downloadP } = CAxios

export default instance
