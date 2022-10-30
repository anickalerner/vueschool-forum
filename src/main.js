import { createApp } from 'vue'
import App from './App.vue'
import AppDate from '@/components/AppDate'
import AppSpinner from '@/components/AppSpinner'
import router from '@/router'
import store from '@/store'
import firebase from 'firebase'
import firebaseConfig from '@/config/firebase'
import FontAwesome from '@/plugins/FontAwesome'
import ClickOutsideDirective from '@/plugins/ClickOutsideDirective'
import PageScrollDirective from '@/plugins/PageScrollDirective'
import Vue3Pagination from '@/plugins/Vue3Pagination'

firebase.initializeApp(firebaseConfig)
firebase.auth().onAuthStateChanged((user) => {
  store.dispatch('auth/unsubscribeAuthSnapshot')
  if (user) {
    store.dispatch('auth/fetchAuthUser')
  }
})
const app = createApp(App)
app.use(router)
app.use(store)
app.use(FontAwesome)
app.use(ClickOutsideDirective)
app.use(PageScrollDirective)
app.use(Vue3Pagination)
app.component('AppDate', AppDate)
app.component('AppSpinner', AppSpinner)
app.mount('#app')
