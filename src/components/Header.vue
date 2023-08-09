<template>
  <div class="head noselect">
    <div class="head-left">
      <div class="icon-box" @click="goHome">
        <img src="@/assets/img/logo.jpg" class="logo" alt="logo" />
        <span>小北笙网易云</span>
      </div>
      <HeaderSearch />
    </div>
    <a-space :size="12" class="operation">
      <div v-if="!userStore.getIsLogin" class="cup head-all-hover" @click="login">登录</div>
      <div v-else class="user-info cup head-all-hover">
        <a-avatar :size="32" @click="getUserInfo">
          <img alt="avatar" :src="userStore.getAvatarUrl" />
        </a-avatar>
        <a-trigger :popup-translate="[0, 18]" trigger="click" :unmount-on-close="false">
          <span style="margin-left: 8px">{{ userStore.getUserName }}</span>
          <template #content>
            <div class="user-trigger">
              <div class="user-trigger-item cup" @click="logout">
                退出登录
                <hr />
              </div>
            </div>
          </template>
        </a-trigger>
      </div>
      <icon-minus class="operation-btn cup head-all-hover z-1000" @click="minimize" />
      <icon-shrink v-if="isMax" class="operation-btn cup head-all-hover z-1000" @click="toggleMaximize" />
      <icon-expand v-else class="operation-btn cup head-all-hover z-1000" @click="toggleMaximize" />
      <icon-close class="operation-btn cup head-all-hover z-1000" @click="close" />
    </a-space>
  </div>
  <a-modal v-model:visible="visible" title="登录" simple @close="closeModal" :footer="false">
    <a-spin class="qr-img" :loading="qrLoading" tip="正在加载...">
      <img :src="imgSrc" alt="" @click="qrImg" />
      <div class="out-data" v-if="isQrMask">
        <div v-if="codeNum === 800">二维码已失效，点击 <span class="cup" @click="qrImg">刷新</span></div>
        <div v-if="codeNum === 802">请在手机上点击确认，如未响应点击 <span class="cup" @click="qrImg">重试</span></div>
      </div>
    </a-spin>
    <div class="tip">{{ tip }}</div>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { getKey, getQrKey, getQrStatus, getLogout, getStatus, getAnonimous } from '@/api/login'
  import { getLikeSongList, getUserAccount, getUserDetail } from '@/api/user'
  import { useUserStore } from '@/store/index'
  import { Message } from '@arco-design/web-vue'
  import { useRouter } from 'vue-router'
  import HeaderSearch from './HeaderSearch.vue'

  const searchPlaceholder = ref('请输入')
  const router = useRouter()
  const userStore = useUserStore()
  const goHome = () => {
    router.push({ name: 'Find' })
  }
  const testIsLogin = () => {
    if (userStore.getIsLogin) {
      getStatus().then((res: any) => {
        const { profile } = res.data
        if (profile && profile.nickname) {
          console.log('当前登录用户' + profile.nickname)
        } else {
          // 退出登录
          logout()
        }
      })
    }
  }
  // 检测登录状态 十分钟检测一次
  setInterval(() => {
    testIsLogin()
  }, 1000 * 60 * 10)
  const tip = ref('使用 网易云音乐APP 扫码登录')
  const key = ref('')
  const codeNum = ref(0)
  const imgSrc = ref('')
  const visible = ref(false)
  const isQrMask = ref(false)
  const qrLoading = ref(false)
  const timer = ref()
  // 获取登录二维码
  const qrImg = async () => {
    isQrMask.value = false
    qrLoading.value = true
    await getKey().then((res: any) => {
      key.value = res.data.unikey
    })

    await getQrKey({ key: key.value, qrimg: true }).then((res: any) => {
      qrLoading.value = false
      imgSrc.value = res.data.qrimg
    })
    changeQrStatus()
  }
  const emit = defineEmits(['refresh'])
  // 扫码状态
  const changeQrStatus = () => {
    clearTimer()
    timer.value = setInterval(() => {
      getQrStatus({ key: key.value }).then((res: any) => {
        // 800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies)
        const { code, cookie, message } = res
        codeNum.value = code
        switch (code) {
          case 800:
            clearTimer()
            isQrMask.value = true
            break
          case 801:
            break
          case 802:
            userStore.setUserName(res.nickname)
            userStore.setAvatarUrl(res.avatarUrl)
            isQrMask.value = true
            break
          case 803:
            clearTimer()
            userStore.setCookie(cookie)
            userStore.setIsLogin(true)
            // 登录成功获取用户信息 id 刷新页面重新请求 推荐内容为用户个性推荐
            getUserAccount().then((res: any) => {
              // window.tools.reload()
              emit('refresh')
              const { account, code } = res
              if (code === 200) {
                userStore.setUid(account.id)
                userStore.setLikeIdList()
              }
            })
            isQrMask.value = false
            visible.value = false
            Message.success(message)
            break
          default:
            Message.error(message || '未知错误')
            break
        }
      })
    }, 1000)
  }
  // 登录
  const login = () => {
    visible.value = true
    qrImg()
  }
  // 游客登录/检测登录状态
  const visitorLogin = () => {
    if (!userStore.getIsLogin) {
      getAnonimous().then((res: any) => {
        const { code, cookie } = res
        if (code === 200) {
          userStore.setCookie(cookie)
          emit('refresh')
        }
      })
    } else {
      testIsLogin()
    }
  }
  // 退出登录
  const logout = async () => {
    await getLogout().then(() => {
      userStore.setUserName('')
      userStore.setAvatarUrl('')
      userStore.setCookie('')
      userStore.setUid(0)
      userStore.setLikeIdList([])
      userStore.setIsLogin(false)
      Message.success('退出登录')
    })
    visitorLogin()
  }

  // 清除定时器
  const clearTimer = () => {
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
  }
  // 用户信息
  const getUserInfo = () => {
    getUserDetail({ uid: userStore.getUid }).then((res: any) => {
      console.log(res)
    })
  }
  // 关闭登录弹框触发
  const closeModal = () => {
    isQrMask.value = false
    clearTimer()
  }

  // 窗口操作相关
  const isMax = ref(false)
  const minimize = () => {
    window.tools.minimize()
  }
  const toggleMaximize = async () => {
    isMax.value = (await window.tools.toggleMaximize()) ? true : false
  }
  const close = () => {
    window.tools.hide()
  }

  onMounted(() => {
    visitorLogin()
    window.electronAPI.isMax((_event: any, message: boolean) => {
      isMax.value = message || false
    })
  })
</script>
<style lang="less">
  .user-trigger {
    width: 150px;
    &-item {
      color: #333333;
    }
    &-item:hover {
      background: #f2f2f3;
    }
  }
</style>
<style scoped lang="less">
  .head {
    display: flex;
    justify-content: space-between;
    height: 56px;
    background: #ec4141;
    align-items: center;
    -webkit-app-region: drag;
    color: #fbd9d9;
    .operation {
      -webkit-app-region: no-drag;
      padding-right: 12px;
      .user-info {
        display: flex;
        align-items: center;
      }
      &-btn {
        font-weight: 700;
        font-size: 18px;
      }
    }
    &-left {
      display: flex;
      align-items: center;
      -webkit-app-region: no-drag;
      .icon-box {
        display: flex;
        align-items: center;
        cursor: pointer;
        .logo {
          height: 32px;
          border-radius: 50%;
          padding: 0 12px;
          will-change: filter;
          transition: filter 300ms;
        }
      }
    }
  }
  .qr-img {
    width: 202px;
    height: 202px;
    position: relative;
    left: calc(50% - 100px);
    border: 1px solid #e4e7f3;
    box-sizing: border-box;
    img {
      width: 200px;
    }
    .out-data {
      width: 100%;
      height: 100%;
      padding: 12px;
      box-sizing: border-box;
      text-align: center;
      position: absolute;
      top: 0;
      font-weight: 700;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      background: rgba(0, 0, 0, 0.7);
      span {
        color: rgb(231, 17, 28);
      }
    }
  }
  .tip {
    margin-top: 12px;
    text-align: center;
  }
  .head-all-hover:hover {
    color: #ffffff;
  }
</style>
