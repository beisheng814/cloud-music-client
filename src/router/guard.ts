import type { Router } from 'vue-router'
import { useUserStore } from '@/store'

export function setupGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    if (to.name === 'Login') {
      next()
    }else {
      // if (userStore.isLogin) {
        next()
      // } else {
      //   next({ name: 'Login' })
      // }
    }
  })
}

export default {}
