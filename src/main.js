import { createApp } from 'vue'
import App from './App.vue'
import AppDate from '@/components/AppDate'
import router from '@/router'
import store from '@/store'
import firebase from 'firebase'
import firebaseConfig from '@/config/firebase'

firebase.initializeApp(firebaseConfig)

const app = createApp(App)
app.use(router)
app.use(store)
app.component('AppDate', AppDate)
app.mount('#app')
