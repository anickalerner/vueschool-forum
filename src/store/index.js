import { createStore } from 'vuex'
import actions from '@/store/actions'
import mutations from '@/store/mutations'
import getters from '@/store/getters'

export default createStore({
  state: {
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: '38St7Q8Zi2N1SPa5ahzssq9kbyp1',
    unsubscribes: []
  },
  actions,
  getters,
  mutations
})
