import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import useAppStore from './modules/app'
import useUserStore from './modules/user'
import useFindStore from './modules/find'
import useSongStore from './modules/song'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export { useAppStore, useUserStore, useFindStore, useSongStore }
export default pinia
