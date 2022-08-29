import { createApp } from 'vue'
import App from './App.vue'
import AppDate from '@/components/AppDate'
import router from '@/router'
import store from '@/store'

const app = createApp(App)
app.use(router)
app.use(store)
app.component('AppDate', AppDate)
app.mount('#app')
