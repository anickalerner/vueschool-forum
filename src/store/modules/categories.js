import { makeFetchItemAction } from '@/helpers'
import firebase from 'firebase'
export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {},
  actions: {
    fetchCategory: makeFetchItemAction({ resource: 'categories' }),
    fetchCategories ({ commit }) {
      const resource = 'categories'
      return new Promise((resolve) => {
        firebase
          .firestore()
          .collection(resource)
          .onSnapshot((querySnapshot) => {
            const categories = querySnapshot.docs.map((doc) => {
              const item = { ...doc.data(), id: doc.id }
              commit('setItem', { resource, item }, { root: true })
              return item
            })
            resolve(categories)
          })
      })
    }
  },
  mutations: {}
}
