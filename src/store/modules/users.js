import { userFBRef } from '../helpers'
import {
  findById,
  makeAppendChildToParentMutation,
  docToResource
} from '@/helpers'
import firebase from 'firebase'
export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {
    user: (state, getters, rootState) => {
      return (id) => {
        const user = findById(state.items, id)
        if (!user) return null
        return {
          ...user,
          get posts () {
            return rootState.posts.items.filter(
              (post) => post.userId === user.id
            )
          },
          get postsCount () {
            return user.postsCount || 0
          },
          get threads () {
            return rootState.threads.items.filter(
              (thread) => thread.userId === user.id
            )
          },
          get threadsCount () {
            return user.threads?.length || 0
          }
        }
      }
    }
  },
  actions: {
    async createUser ({ commit }, { id, email, name, username, avatar = null }) {
      const registeredAt = firebase.firestore.FieldValue.serverTimestamp()
      const usernameLower = username.toLowerCase()
      email = email.toLowerCase()
      const user = {
        avatar,
        email,
        name,
        username,
        usernameLower,
        registeredAt
      }
      const userRef = await userFBRef(id)
      userRef.set(user)
      const newUser = await userRef.get()
      commit('setItem', { resource: 'users', item: newUser }, { root: true })
      return docToResource(newUser)
    },
    updateUser (context, user) {
      const updates = {
        avatar: user.avatar || null,
        username: user.username || null,
        name: user.name || null,
        bio: user.bio || null,
        website: user.website || null,
        email: user.email || null,
        location: user.location || null
      }
      const userRef = userFBRef(user.id)
      userRef.update(updates)
      context.commit(
        'setItem',
        {
          resource: 'users',
          item: user
        },
        { root: true }
      )
    },
    fetchUser: ({ dispatch }, { id }) =>
      dispatch('fetchItem', { resource: 'users', id }, { root: true }),
    fetchUsers ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'users', ids }, { root: true })
    }
  },

  mutations: {
    appendThreadToUser: makeAppendChildToParentMutation({
      parent: 'users',
      child: 'threads'
    })
  }
}
