import {
  findById,
  makeAppendChildToParentMutation,
  makeFetchItemAction,
  makeFetchItemsAction
} from '@/helpers'

export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {
    forumById: (state) => (forumId) => {
      return findById(state.items, forumId)
    }
  },
  actions: {
    fetchForum: makeFetchItemAction({ resource: 'forums' }),
    fetchForums: makeFetchItemsAction({ resource: 'forums' })
  },
  mutations: {
    appendThreadToForum: makeAppendChildToParentMutation({
      parent: 'forums',
      child: 'threads'
    })
  }
}
