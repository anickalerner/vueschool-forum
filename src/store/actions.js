import { findById } from '@/helpers'
import firebase from 'firebase'
export default {
  unsubscribeAllSnapshots ({ state, commit }) {
    state.unsubscribes.forEach((unsubscribe) => unsubscribe())
    commit('clearAllUnsubscribes')
  },
  fetchItem (
    { commit, state },
    {
      resource,
      id,
      handleUnsubscribe = null,
      doSetItems = true,
      once = false,
      onSnapshot = null
    }
  ) {
    return new Promise((resolve) => {
      const unsubscribe = firebase
        .firestore()
        .collection(resource)
        .doc(id)
        .onSnapshot((doc) => {
          if (once) {
            unsubscribe()
          }
          if (doc.exists) {
            const item = { ...doc.data(), id: doc.id }
            let previousItem = findById(state.threads.items, id)
            previousItem = previousItem ? { ...previousItem } : null
            if (doSetItems) commit('setItem', { resource, item })
            if (typeof onSnapshot === 'function') {
              const isLocal = doc.metadata.hasPendingWrites
              onSnapshot({ item: { ...item }, previousItem, isLocal })
            }
            resolve(item)
          } else {
            resolve(null)
          }
        })
      if (handleUnsubscribe) {
        handleUnsubscribe(unsubscribe)
      } else {
        commit('appendUnsubscribe', { unsubscribe })
      }
    })
  },
  fetchItems ({ dispatch }, { resource, ids, doSetItems, onSnapshot = null }) {
    if (!ids || ids.length === 0) return []
    return Promise.all(
      ids.map((item) => {
        return dispatch('fetchItem', {
          resource,
          id: item,
          doSetItems,
          onSnapshot
        })
      })
    )
  }
}
