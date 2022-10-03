import { createApp } from 'vue'
import App from './App.vue'
import AppDate from '@/components/AppDate'
import AppSpinner from '@/components/AppSpinner'
import router from '@/router'
import store from '@/store'
import firebase from 'firebase'
import firebaseConfig from '@/config/firebase'
import FontAwesome from '@/plugins/FontAwesome'

firebase.initializeApp(firebaseConfig)
const app = createApp(App)
app.use(router)
app.use(store)
app.use(FontAwesome)
app.component('AppDate', AppDate)
app.component('AppSpinner', AppSpinner)
app.mount('#app')
