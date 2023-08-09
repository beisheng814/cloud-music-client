import { contextBridge, ipcRenderer, shell } from 'electron'
contextBridge.exposeInMainWorld('electronAPI', {
  isMin: () => {
    ipcRenderer.on('window-minimized', (_, data) => {
      return data
    })
  },
  isMax: (func: any) => {
    ipcRenderer.on('set-maxminicon', (event, ...args) => func(event, ...args))
  },
  lrcStatus: (func: any) => {
    ipcRenderer.on('lrc-status', (event, ...args) => func(event, ...args))
  },
  goExternalPage: async function (url: string): Promise<void> {
    await ipcRenderer.invoke('goExternalPage', url)
  },
  moveNewWin: async function (x: number, y: number): Promise<void> {
    await ipcRenderer.invoke('move-new-win', x, y)
  },
  changeCurrentTime: async function (flag: boolean, time: number): Promise<void> {
    await ipcRenderer.invoke('change-current-time', flag, time)
  },
  changeNewWindowTime: (func: any) => {
    ipcRenderer.on('change-current-time', (event, ...args) => func(event, ...args))
  },
  setLrcWinData: async function (isPlay: boolean, songId: number, lrc: any): Promise<void> {
    await ipcRenderer.invoke('set-lrc-win-data', isPlay, songId, lrc)
  },
  getLrcWinData: (func: any) => {
    ipcRenderer.on('get-lrc-win-data', (event, ...args) => func(event, ...args))
  },
  setTrayMenuTitle: (func: any) => {
    ipcRenderer.on('set-tray-menu-title', (event, ...args) => func(event, ...args))
  },
  switchSongs: async function (type: string): Promise<void> {
    await ipcRenderer.invoke('switch-songs', type)
  },
  setPlaySong: (func: any) => {
    ipcRenderer.on('set-play-song', (event, ...args) => func(event, ...args))
  },
  setTrayMenuStatus: async function (isPlay: boolean, desktopLrc: boolean, mode: string): Promise<void> {
    await ipcRenderer.invoke('set-tray-menu-status', isPlay, desktopLrc, mode)
  },
  getTrayMenuStatus: (func: any) => {
    ipcRenderer.on('get-tray-menu-status', (event, ...args) => func(event, ...args))
  },
  toggleLrcShow: async function (flag: boolean): Promise<void> {
    await ipcRenderer.invoke('toggle-lrc-show', flag)
  },
  setGoPage: async function (page: string): Promise<void> {
    await ipcRenderer.invoke('set-go-page', page)
  },
  getGoPage: (func: any) => {
    ipcRenderer.on('get-go-page', (event, ...args) => func(event, ...args))
  },
})
contextBridge.exposeInMainWorld('playTools', {})
const tools = {
  songTitle: async function (title: string): Promise<void> {
    await ipcRenderer.invoke('songTitle', title)
  },
  toggleMaximize: async function (): Promise<boolean> {
    return await ipcRenderer.invoke('toggleMaximize')
  },
  minimize: async function (): Promise<void> {
    await ipcRenderer.invoke('minimize')
  },
  close: async function (): Promise<void> {
    await ipcRenderer.invoke('close')
  },
  hide: async function (): Promise<void> {
    await ipcRenderer.invoke('hide')
  },
  newClose: async function (): Promise<void> {
    await ipcRenderer.invoke('new-close')
  },
  createNewWindow: async function (routerPath: string): Promise<void> {
    await ipcRenderer.invoke('create-new-window', routerPath)
  },
  downloadFile: async function (url: string, filename: string): Promise<any> {
    return await ipcRenderer.invoke('download-file', url, filename)
  },
  requestSubscribe: async function (url: string): Promise<any> {
    return await ipcRenderer.invoke('request', url)
  },
  reload: async function (): Promise<void> {
    await ipcRenderer.invoke('reload')
  }
}
contextBridge.exposeInMainWorld('tools', tools)

// contextBridge.exposeInMainWorld('process', process)

// 原先的内容
function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise(resolve => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find(e => e === child)) {
      return parent.appendChild(child)
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find(e => e === child)) {
      return parent.removeChild(child)
    }
  }
}

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = `loaders-css__square-spin`
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')

  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle)
      safeDOM.append(document.body, oDiv)
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle)
      safeDOM.remove(document.body, oDiv)
    }
  }
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = ev => {
  ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)
