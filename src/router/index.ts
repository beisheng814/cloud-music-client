import Layout from '@/layouts/index.vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { setupGuard } from './guard'

const modules = import.meta.glob('./modules/*.ts', { eager: true, import: 'default' })
const appRoutes: RouteRecordRaw[] = []

function sortByOrder(children: RouteRecordRaw[]) {
  children.sort((a, b) => {
    if (a.meta && b.meta) {
      return (a.meta.order ?? 0) - (b.meta.order ?? 0)
    }
    return 0
  })
}

Object.keys(modules).forEach(key => {
  const defaultModule = modules[key]
  if (!defaultModule) {
    return
  }
  const moduleList = Array.isArray(defaultModule) ? [...defaultModule] : [defaultModule]

  // 对路由进行排序
  moduleList.forEach((module: RouteRecordRaw) => {
    if (module?.children && module.children.length > 1) {
      sortByOrder(module.children)
    }
  })
  appRoutes.push(...moduleList)
})

appRoutes.sort((a, b) => {
  if (a.meta && b.meta) {
    return (a.meta.order ?? 0) - (b.meta.order ?? 0)
  }
  return 0
})

export const RootRoute: RouteRecordRaw = {
  path: '/',
  name: 'root',
  component: Layout,
  redirect: '/find',
  children: [...appRoutes]
}

export const LyricRoute: RouteRecordRaw = {
  path: '/lyric',
  name: 'Lyric',
  component: () => import('@/views/lyric/index.vue')
}

export const TrayMenuRoute: RouteRecordRaw = {
  path: '/trayMenu',
  name: 'TrayMenu',
  component: () => import('@/views/trayMenu/index.vue')
}
export const VideoDetailRoute: RouteRecordRaw = {
  path: '/videoDetail',
  name: 'VideoDetail',
  component: () => import('@/views/details/videoDetail.vue')
}

const router = createRouter({
  history: createWebHashHistory(),
  routes: [RootRoute, LyricRoute, TrayMenuRoute, VideoDetailRoute],
  scrollBehavior() {
    return { top: 0 }
  }
})
setupGuard(router)
export default router
