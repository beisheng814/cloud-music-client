import { app, BrowserWindow, Tray, Menu, shell, ipcMain, globalShortcut, screen } from 'electron'
import { download } from 'electron-dl'
import { release } from 'node:os'
import { join } from 'node:path'

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, '../public') : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
let tray = null
let win: BrowserWindow | null = null
let lrcWindow: BrowserWindow | null = null
let trayMenuWindow: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

const urls = require('url')
// 创建桌面歌词窗口的函数
function createLrcWindow(routerPath) {
  // 获取主显示器的工作区尺寸（即不包括任务栏和其他操作系统界面元素的区域）的宽度和高度
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  lrcWindow = new BrowserWindow({
    width: 880,
    height: 140,
    resizable: false,
    // width: 1000,
    // height: 180,
    // minWidth: 600,
    // minHeight: 150,
    // maxWidth: 1600,
    // maxHeight: 300,
    x: Math.floor((width - 880) / 2),
    y: Math.floor(height * 0.8),
    skipTaskbar: true, // 取消在任务栏预览窗口中显示
    alwaysOnTop: true, // 始终在窗口最前面
    transparent: true,
    // frame boolean (可选) - 设置为 false 时可以创建一个无边框窗口 默认值为 true。 即没有头部默认关闭那栏
    frame: false,
    webPreferences: {
      preload
    }
  })
  // 确保使用正确的文件路径
  const filePath = urls.format({
    pathname: process.env.VITE_DEV_SERVER_URL ? url : indexHtml,
    hash: routerPath
  })
  if (process.env.VITE_DEV_SERVER_URL) {
    lrcWindow.webContents.openDevTools()
  }
  // 载入 Vue 应用的 HTML 文件，并指定子路由的 hash 值
  lrcWindow.loadURL(filePath)
  win?.webContents.send('lrc-status', true)
  // 当新窗口关闭时，将其置为 null
  lrcWindow.on('closed', () => {
    lrcWindow = null
  })
}
ipcMain.handle('move-new-win', (_, x, y) => {
  lrcWindow && lrcWindow.setPosition(x, y)
})
// 歌词窗口关闭
ipcMain.handle('new-close', () => {
  win?.webContents.send('lrc-status', false)
  // 隐藏窗口
  // lrcWindow.hide()
  // 关闭窗口
  lrcWindow.close()
})
// 监听来自渲染进程的创建新窗口的请求
ipcMain.handle('create-new-window', (_, routerPath) => {
  createLrcWindow(routerPath)
})
// 播放时间变化
ipcMain.handle('change-current-time', (_, flag, time) => {
  if (flag) {
    lrcWindow?.webContents.send('change-current-time', time)
  }
})
// 设置歌词窗口数据
ipcMain.handle('set-lrc-win-data', (_, isPlay, songId, lrc) => {
  lrcWindow?.webContents.send('get-lrc-win-data', isPlay, songId, lrc)
})

async function createWindow() {
  win = new BrowserWindow({
    title: '小北笙音乐',
    width: 1000,
    height: 700,
    minWidth: 1000,
    minHeight: 700,
    icon: join(process.env.PUBLIC, 'logo.jpg'),
    // frame boolean (可选) - 设置为 false 时可以创建一个无边框窗口 默认值为 true。 即没有头部默认关闭那栏
    frame: false,
    webPreferences: {
      preload
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // nodeIntegration: true,
      // contextIsolation: false
    }
  })
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(url)
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }
  // 移除操作菜单
  win.removeMenu()
  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // 关闭主窗口时同时关闭其他窗口
  win.on('closed', () => {
    // 销毁其他子窗口
    if (lrcWindow) {
      lrcWindow.close()
      lrcWindow = null
    }
    if (trayMenuWindow) {
      trayMenuWindow.close()
      trayMenuWindow = null
    }
  })

  // 设置进程通信
  setIpc()
  // 设置托盘
  setTray()

  // 监听窗口最小化事件
  win.on('minimize', () => {
    // 发送消息到渲染进程
    win.webContents.send('window-minimized', true)
  })
  // 监听窗口取消最小化事件
  win.on('restore', () => {
    // 发送消息到渲染进程
    win.webContents.send('window-minimized', false)
  })

  win.on('resize', () => {
    win?.webContents.send('set-maxminicon', win.isMaximized())
  })

  // 开发环境注册快捷键
  if (process.env.VITE_DEV_SERVER_URL) {
    globalShortcut.register('Ctrl+Alt+I', () => {
      win.webContents.openDevTools()
    })
    globalShortcut.register('Ctrl+R', () => {
      win.reload()
      if (lrcWindow) {
        lrcWindow.reload()
      }
    })
  }
}

app.whenReady().then(createWindow)

// 设置IPC 进程通信
function setIpc() {
  // 跳转链接打开外部浏览器
  ipcMain.handle('goExternalPage', (_, url: string) => {
    shell.openExternal(url)
  })
  // 下载文件
  ipcMain.handle('download-file', async (_, url, filename) => {
    try {
      const dl = await download(BrowserWindow.getFocusedWindow(), url, {
        saveAs: true,
        directory: app.getPath('downloads'),
        filename: filename
      })
      console.log('Download complete:', dl.getSavePath())
      return dl.getSavePath() // 返回下载成功的文件路径
    } catch (error) {
      console.error('Error downloading file:', error)
      throw error // 抛出下载错误
    }
  })
  // 窗口最大化/重置事件
  ipcMain.handle('toggleMaximize', () => {
    const isMaximized = win.isMaximized()
    win[!isMaximized ? 'maximize' : 'restore']()
    return !isMaximized
  })
  // 窗口最小化事件
  ipcMain.handle('minimize', () => {
    const isMinimized = win.isMinimized()
    !isMinimized && win.minimize()
    console.log(process.env.VITE_DEV_SERVER_URL, process.env.PUBLIC)
  })
  // 窗口关闭事件
  ipcMain.handle('close', () => {
    // 关闭窗口
    win.close()
  })
  // 隐藏窗口
  ipcMain.handle('hide', () => {
    // 隐藏窗口
    win.hide()
  })
  // 窗口刷新
  ipcMain.handle('reload', () => {
    win.reload()
  })
  ipcMain.handle('songTitle', (_, title) => {
    // 设置托盘显示文本
    tray.setToolTip(title)
    // 托盘菜单歌曲信息
    trayMenuWindow?.webContents.send('set-tray-menu-title', title)
  })
  // 上一首下一首
  ipcMain.handle('switch-songs', (_, type) => {
    win?.webContents.send('set-play-song', type)
  })
  // 托盘菜单数据状态
  ipcMain.handle('set-tray-menu-status', (_, isPlay, desktopLrc, mode) => {
    trayMenuWindow?.webContents.send('get-tray-menu-status', isPlay, desktopLrc, mode)
  })
  // 打开/关闭桌面歌词
  ipcMain.handle('toggle-lrc-show', (_, flag) => {
    if (flag) {
      createLrcWindow('lyric')
    } else {
      if (lrcWindow) {
        lrcWindow.close()
      }
    }
  })
    // 子窗口让父窗口去某个页面
    ipcMain.handle('set-go-page', (_, page) => {
      win?.webContents.send('get-go-page', page)
    })
}

// 创建系统托盘
function setTray() {
  tray = new Tray(join(process.env.PUBLIC, 'logo.jpg'))
  // 创建托盘菜单窗口
  trayMenuWindow = new BrowserWindow({
    width: 420,
    height: 400,
    show: false,
    frame: false,
    resizable: false,
    skipTaskbar: true, // 取消在任务栏预览窗口中显示
    alwaysOnTop: true, // 始终在窗口最前面
    transparent: true,
    webPreferences: {
      preload
    }
  })
  // 确保使用正确的文件路径  hash为vue路由路径
  const filePath = urls.format({
    pathname: process.env.VITE_DEV_SERVER_URL ? url : indexHtml,
    hash: 'trayMenu'
  })
  // 载入 Vue 应用的 HTML 文件，并指定子路由的 hash 值
  trayMenuWindow.loadURL(filePath)
  tray.on('right-click', () => {
    if (process.env.VITE_DEV_SERVER_URL) {
      trayMenuWindow.webContents.openDevTools()
    }
    const position = tray.getBounds()
    const { x, y } = position
    // 显示托盘菜单窗口
    trayMenuWindow.setPosition(x - 180, y - 385)
    trayMenuWindow.show()
  })
  // 失去焦点时隐藏
  trayMenuWindow.on('blur', () => {
    trayMenuWindow.hide()
  })

  // 设置任务栏图标的提示文本
  tray.setToolTip('小北笙网易云')
  // 托盘被点击时触发的事件
  tray.on('click', () => {
    // 在这里编写点击托盘时的逻辑
    // 例如，显示/隐藏主窗口、执行某个操作等
    win.isVisible() ? win.hide() : win.show()
  })
}

// 在所有窗口关闭时
app.on('window-all-closed', () => {
  // 销毁系统托盘
  if (tray && !tray.isDestroyed()) {
    tray.destroy()
  }
  // 注销快捷键
  globalShortcut.unregister('Ctrl+Alt+I')
  globalShortcut.unregister('Ctrl+R')
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
