import 'axios'

declare module 'axios' {
  interface RS<T = any> {
[x: string]: any
    code: number
    err_no: number
    msg: string
    data: T
    total?: number
  }
}
