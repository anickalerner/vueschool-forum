import firebase from 'firebase'
export default {
  unsubscribeAllSnapshots ({ state, commit }) {
    state.unsubscribes.forEach((unsubscribe) => unsubscribe())
    commit('clearAllUnsubscribes')
  },
  fetchItem ({ commit }, { resource, id, handleUnsubscribe = null, doSetItems = true }) {
    return new Promise((resolve) => {
      const unsubscribe = firebase
        .firestore()
        .collection(resource)
        .doc(id)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const item = { ...doc.data(), id: doc.id }
            if (doSetItems) commit('setItem', { resource, item })
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
  fetchItems ({ dispatch }, { resource, ids, doSetItems }) {
    if (!ids || ids.length === 0) return []
    return Promise.all(
      ids.map((item) => {
        return dispatch('fetchItem', { resource, id: item, doSetItems })
      })
    )
  }
}
