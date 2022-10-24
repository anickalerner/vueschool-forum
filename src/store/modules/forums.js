import { findById, makeAppendChildToParentMutation } from '@/helpers'

export default {
  namespace: true,
  state: {
    items: []
  },
  getters: {
    forumById: (state) => (forumId) => {
      return findById(state.items, forumId)
    }
  },
  actions: {
    fetchForum: ({ dispatch }, { id }) =>
      dispatch('fetchItem', { resource: 'forums', id }, { root: true }),
    fetchForums ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'forums', ids }, { root: true })
    }
  },
  mutations: {
    appendThreadToForum: makeAppendChildToParentMutation({
      parent: 'forums',
      child: 'threads'
    })
  }
}
