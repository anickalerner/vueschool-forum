import { createStore } from 'vuex'
import actions from '@/store/actions'
import mutations from '@/store/mutations'
import getters from '@/store/getters'
import categories from './modules/categories'
import forums from './modules/forums'
import threads from './modules/threads'
import posts from './modules/posts'
import users from './modules/users'

export default createStore({
  modules: {
    categories,
    forums,
    threads,
    posts,
    users
  },
  state: {
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    unsubscribes: []
  },
  actions,
  getters,
  mutations
})
