import { threadFBRef, postsFBRef, postFBRef, userFBRef } from '../helpers'
import { findById } from '@/helpers'
import firebase from 'firebase'

export default {
  namespaced: true,
  state: {
    items: []
  },
  actions: {
    async createPost ({ commit, state, rootState }, post) {
      post.userId = rootState.auth.authId
      if (!post.publishedAt) {
        post.publishedAt = firebase.firestore.FieldValue.serverTimestamp()
      }
      const batch = firebase.firestore().batch()
      const postRef = postsFBRef()
      const userRef = userFBRef(rootState.auth.authId)

      const threadRef = threadFBRef(post.threadId)
      batch.set(postRef, post)
      batch.update(threadRef, {
        posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
        contributors: firebase.firestore.FieldValue.arrayUnion(
          rootState.auth.authId
        )
      })
      batch.update(userRef, {
        postsCount: firebase.firestore.FieldValue.increment(1)
      })
      await batch.commit()
      const newPost = await postRef.get()
      commit(
        'setItem',
        {
          resource: 'posts',
          item: { ...newPost.data(), id: newPost.id }
        },
        { root: true }
      )
      commit(
        'threads/appendPostToThread',
        {
          childId: newPost.id,
          parentId: post.threadId
        },
        { root: true }
      )
      commit(
        'threads/appendContributorToThread',
        {
          childId: rootState.auth.authId,
          parentId: post.threadId
        },
        { root: true }
      )
      return newPost
    },
    async updatePost ({ commit, state, rootState }, { text, id }) {
      const post = {
        ...findById(state.items, id),
        text,
        edited: {
          at: firebase.firestore.FieldValue.serverTimestamp(),
          by: rootState.auth.authId,
          moderated: false
        }
      }
      const postRef = postFBRef(id)
      postRef.update(post)
      const newPost = await postRef.get()
      commit('setItem', { resource: 'posts', item: newPost }, { root: true })
    },
    fetchPosts ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'posts', ids }, { root: true })
    }
  }
}
