import {
  findById,
  docToResource,
  makeAppendChildToParentMutation
} from '@/helpers'
import firebase from 'firebase'

import {
  threadFBRef,
  threadsFBRef,
  postFBRef,
  userFBRef,
  forumFBRef
} from '../helpers'
export default {
  namespace: true,
  state: {
    items: []
  },
  getters: {
    threadsByUser: (state) => (id) => {
      return state.items.filter((thread) => thread.userId === id)
    },
    threadById: (state, getters, rootState) => (id) => {
      const thread = findById(state.items, id)
      if (!thread) return {}
      return {
        ...thread,
        get author () {
          return findById(rootState.users.items, thread?.userId)
        },
        get repliesCount () {
          return thread?.posts.length - 1
        },
        get contributorsCount () {
          return thread?.contributors?.length
        }
      }
    },
    titleToSlug: () => (title) => {
      return title.split(' ').join('-')
    }
  },
  actions: {
    async createThread ({ commit, state, dispatch }, { title, text, forumId }) {
      const createdTimeStamp = firebase.firestore.FieldValue.serverTimestamp()
      const slug = this.getters.titleToSlug(title)
      const threadRef = threadsFBRef()
      const thread = {
        forumId,
        lastPostAt: createdTimeStamp,
        publishedAt: createdTimeStamp,
        slug,
        title,
        userId: state.authId,
        posts: []
      }
      const userRef = userFBRef(thread.userId)
      const forumRef = forumFBRef(forumId)

      const batch = firebase.firestore().batch()
      batch.set(threadRef, thread)
      batch.update(forumRef, {
        threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
      })
      batch.update(userRef, {
        threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
      })
      await batch.commit()
      const newThread = await threadRef.get()
      commit(
        'setItem',
        {
          resource: 'threads',
          item: newThread
        },
        { root: true }
      )
      const firstPost = {
        text,
        threadId: threadRef.id,
        publishedAt: createdTimeStamp
      }
      commit(
        'forums/appendThreadToForum',
        {
          parentId: forumId,
          childId: threadRef.id
        },
        { root: true }
      )
      commit(
        'users/appendThreadToUser',
        {
          parentId: state.authId,
          childId: threadRef.id
        },
        { root: true }
      )
      dispatch('posts/createPost', firstPost, { root: true })
      return newThread
    },
    async updateThread ({ commit, state }, { title, text, id }) {
      const batch = firebase.firestore().batch()
      const thread = { ...findById(state.items, id), title }
      const threadRef = threadFBRef(id)
      const post = { ...findById(state.posts, thread.posts[0]), text }
      const postRef = postFBRef(thread.posts[0])
      batch.update(threadRef, thread)
      batch.update(postRef, post)
      await batch.commit()
      const newThread = await threadRef.get()
      const newPost = await postRef.get()
      console.log({ ...newPost })
      commit(
        'setItem',
        { resource: 'threads', item: newThread },
        { root: true }
      )
      commit('setItem', { resource: 'posts', item: newPost }, { root: true })
      return docToResource(newThread)
    },
    fetchThread ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'threads', id }, { root: true })
    },
    fetchThreads ({ dispatch }, { ids }) {
      return dispatch(
        'fetchItems',
        { resource: 'threads', ids },
        { root: true }
      )
    }
  },
  mutations: {
    appendPostToThread: makeAppendChildToParentMutation({
      parent: 'threads',
      child: 'posts'
    }),
    appendContributorToThread: makeAppendChildToParentMutation({
      parent: 'threads',
      child: 'contributors'
    })
  }
}
