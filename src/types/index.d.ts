interface ITools {
  toggleMaximize: () => Promise<boolean>
  minimize: () => Promise<void>
  close: () => Promise<void>
  hide: () => Promise<void>
  newClose: () => Promise<void>
  createNewWindow: (routerPath: string) => Promise<void>
  songTitle: (title: string) => Promise<void>
  requestSubscribe: (url: string) => Promise<any>
  downloadFile: (url: string, filename: string) => Promise<any>
  reload: () => Promise<void>
}
interface Window {
  electronAPI: any
  playTools: any
  tools: ITools
}
declare global {
  interface ITools {
    toggleMaximize: () => Promise<boolean>
    minimize: () => Promise<void>
    close: () => Promise<void>
    hide: () => Promise<void>
    newClose: () => Promise<void>
    createNewWindow: (routerPath: string) => Promise<void>
    songTitle: (title: string) => Promise<void>
    requestSubscribe: (url: string) => Promise<any>
    downloadFile: (url: string, filename: string) => Promise<any>
    reload: () => Promise<void>
  }
  interface Window {
    electronAPI: any
    playTools: any
    tools: ITools
  }
}
