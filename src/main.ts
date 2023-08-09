import { createApp } from 'vue'
import './style.css'
import './assets/iconfont/iconfont.css'
import './style/index.less'
import App from './App.vue'
import router from './router'
import '@arco-design/web-vue/dist/arco.css'
import pinia from './store'

const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
