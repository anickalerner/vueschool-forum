import { createStore } from 'vuex'
import { findById, upsert } from '@/helpers'
import firebase from 'firebase'

export default createStore({
  state: {
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: '7uVPJS9GHoftN58Z2MXCYDqmNAh2'
  },
  getters: {
    authUser: (state, getters) => {
      return getters.user(state.authId)
    },
    user: (state) => {
      return (id) => {
        const user = findById(state.users, id)
        if (!user) return null
        return {
          ...user,
          get posts () {
            return state.posts.filter((post) => post.userId === user.id)
          },
          get postsCount () {
            return this.posts.length
          },
          get threads () {
            return state.threads.filter((thread) => thread.userId === user.id)
          },
          get threadsCount () {
            return this.threads.length
          }
        }
      }
    },
    threadById: (state) => (id) => {
      const thread = findById(state.threads, id)
      if (!thread) return {}
      return {
        ...thread,
        get author () {
          return findById(state.users, thread?.userId)
        },
        get repliesCount () {
          return thread?.posts.length - 1
        },
        get contributorsCount () {
          return thread?.contributors?.length
        }
      }
    },
    forumById: (state) => (forumId) => {
      return findById(state.forums, forumId)
    },
    titleToSlug: (state) => (title) => {
      return title.split(' ').join('-')
    }
  },
  actions: {
    async createPost ({ commit, state }, post) {
      post.userId = state.authId
      if (!post.publishedAt) {
        post.publishedAt = Math.floor(Date.now() / 1000)
      }
      commit('setItem', { resource: 'posts', item: post })
      commit('appendPostToThread', {
        childId: post.id,
        parentId: post.threadId
      })
      commit('appendContributorToThread', {
        childId: state.authId,
        parentId: post.threadId
      })
      return post
    },
    async createThread ({ commit, state, dispatch }, { title, text, forumId }) {
      const createdTimeStamp = Math.floor(Date.now() / 1000)
      const slug = this.getters.titleToSlug(title)
      const id = 'ggqq' + Math.random()
      const thread = {
        id,
        forumId,
        lastPostAt: createdTimeStamp,
        publishedAt: createdTimeStamp,
        slug,
        title,
        userId: state.authId,
        posts: []
      }
      commit('setItem', { resource: 'threads', item: thread })
      const firstPost = {
        text,
        threadId: id,
        publishedAt: createdTimeStamp
      }
      dispatch('createPost', firstPost)
      commit('appendThreadToForum', { parentId: forumId, childId: id })
      return findById(state.threads, id)
    },
    updateThread ({ commit, state }, { title, text, id }) {
      const thread = { ...findById(state.threads, id), title }
      commit('setItem', { resource: 'threads', item: thread })
      const post = { ...thread.posts[0], text }
      commit('setItem', { resource: 'posts', item: post })
    },
    updateUser (context, userToUpdate) {
      context.commit('setItem', { resource: 'users', item: userToUpdate })
    },
    fetchCategory ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'categories', id })
    },
    fetchForum ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'forums', id })
    },
    fetchThread ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'threads', id })
    },
    fetchPost ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'posts', id })
    },
    fetchUser ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'users', id })
    },
    fetchItem ({ commit }, { resource, id }) {
      return new Promise((resolve) => {
        firebase
          .firestore()
          .collection(resource)
          .doc(id)
          .onSnapshot((doc) => {
            const item = { ...doc.data(), id: doc.id }
            commit('setItem', { resource, item })
            resolve(item)
          })
      })
    },
    fetchCategories ({ commit }) {
      const resource = 'categories'
      return new Promise((resolve) => {
        firebase
          .firestore()
          .collection(resource)
          .onSnapshot((querySnapshot) => {
            const categories = querySnapshot.docs.map((doc) => {
              const item = { ...doc.data(), id: doc.id }
              commit('setItem', { resource, item })
              return item
            })
            resolve(categories)
          })
      })
    },
    fetchForums ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'forums', ids })
    },
    fetchThreads ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'threads', ids })
    },
    fetchPosts ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'posts', ids })
    },
    fetchUsers ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'users', ids })
    },
    fetchItems ({ dispatch }, { resource, ids }) {
      if (!ids || ids.length === 0) return []
      return Promise.all(
        ids.map((item) => {
          return dispatch('fetchItem', { resource, id: item })
        })
      )
    }
  },
  mutations: {
    setItem (state, { resource, item }) {
      upsert(state[resource], item)
    },
    appendPostToThread: makeAppendChildToParentMutation({
      parent: 'threads',
      child: 'posts'
    }),
    appendThreadToForum: makeAppendChildToParentMutation({
      parent: 'forums',
      child: 'threads'
    }),
    appendContributorToThread: makeAppendChildToParentMutation({
      parent: 'threads',
      child: 'contributors'
    })
  }
})

function makeAppendChildToParentMutation ({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId)
    if (!resource) {
      console.warn(
        `Appending ${child} ${childId} to ${parent} ${parentId} failed because the parent didn't exist`
      )
      return
    }
    resource[child] = resource[child] || []
    const ind = resource[child].findIndex((c) => c === childId)
    if (ind === -1) {
      resource[child].push(childId)
    }
  }
}
