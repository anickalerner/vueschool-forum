import {
  findById,
  docToResource,
  makeAppendChildToParentMutation,
  makeFetchItemAction,
  makeFetchItemsAction
} from '@/helpers'
import firebase from 'firebase'

import {
  threadFBRef,
  threadsFBRef,
  postFBRef,
  userFBRef,
  forumFBRef
} from '../helpers'
import chunk from 'lodash/chunk'
export default {
  namespaced: true,
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
    async createThread (
      { commit, state, dispatch, rootState },
      { title, text, forumId }
    ) {
      const createdTimeStamp = firebase.firestore.FieldValue.serverTimestamp()
      console.log('create thread this:', this)
      const slug = this.getters['threads/titleToSlug'](title)
      const threadRef = threadsFBRef()
      const thread = {
        forumId,
        lastPostAt: createdTimeStamp,
        publishedAt: createdTimeStamp,
        slug,
        title,
        userId: rootState.auth.authId,
        firstPostId: '',
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
          parentId: rootState.auth.authId,
          childId: threadRef.id
        },
        { root: true }
      )
      const newPost = await dispatch('posts/createPost', firstPost, {
        root: true
      })
      newThread.firstPostId = newPost.id
      const updateBatch = firebase.firestore().batch()
      updateBatch.update(threadRef, {
        ...findById(state.items, newThread.id),
        firstPostId: newPost.id
      })
      await updateBatch.commit()
      return newThread
    },
    async updateThread ({ commit, state, rootState }, { title, text, id }) {
      const batch = firebase.firestore().batch()
      const thread = { ...findById(state.items, id), title }
      const threadRef = threadFBRef(id)
      const post = { ...findById(rootState.posts.items, thread.posts[0]), text }
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
    fetchThread: makeFetchItemAction({ resource: 'threads' }),
    fetchThreads: makeFetchItemsAction({ resource: 'threads' }),
    fetchThreadsByPage ({ dispatch, commit }, { ids, page, perPage = 10 }) {
      commit('clearThreads')
      const chunks = chunk(ids, perPage)
      const limitedIds = chunks[page - 1]
      return dispatch('fetchThreads', { ids: limitedIds })
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
    }),
    clearThreads (state) {
      state.items = []
    }
  }
}
