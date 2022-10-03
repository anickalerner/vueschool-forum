import { findById, docToResource } from '@/helpers'
import firebase from 'firebase'

function postsFBRef () {
  return firebase.firestore().collection('posts').doc()
}
function postFBRef (id) {
  return firebase.firestore().collection('posts').doc(id)
}
function userFBRef (id) {
  return firebase.firestore().collection('users').doc(id)
}
function threadFBRef (id) {
  return firebase.firestore().collection('threads').doc(id)
}
function threadsFBRef () {
  return firebase.firestore().collection('threads').doc()
}
function forumFBRef (id) {
  return firebase.firestore().collection('forums').doc(id)
}
export default {
  async createPost ({ commit, state }, post) {
    post.userId = state.authId
    if (!post.publishedAt) {
      post.publishedAt = firebase.firestore.FieldValue.serverTimestamp()
    }
    const batch = firebase.firestore().batch()
    const postRef = postsFBRef()
    const userRef = userFBRef(state.authId)

    const threadRef = threadFBRef(post.threadId)
    batch.set(postRef, post)
    batch.update(threadRef, {
      posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
      contributors: firebase.firestore.FieldValue.arrayUnion(state.authId)
    })
    batch.update(userRef, {
      postsCount: firebase.firestore.FieldValue.increment(1)
    })
    await batch.commit()
    const newPost = await postRef.get()
    commit('setItem', {
      resource: 'posts',
      item: { ...newPost.data(), id: newPost.id }
    })
    commit('appendPostToThread', {
      childId: newPost.id,
      parentId: post.threadId
    })
    commit('appendContributorToThread', {
      childId: state.authId,
      parentId: post.threadId
    })
  },
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
    commit('setItem', {
      resource: 'threads',
      item: newThread
    })
    const firstPost = {
      text,
      threadId: threadRef.id,
      publishedAt: createdTimeStamp
    }
    commit('appendThreadToForum', { parentId: forumId, childId: threadRef.id })
    commit('appendThreadToUser', {
      parentId: state.authId,
      childId: threadRef.id
    })
    dispatch('createPost', firstPost)
    return newThread
  },
  async updateThread ({ commit, state }, { title, text, id }) {
    const batch = firebase.firestore().batch()
    const thread = { ...findById(state.threads, id), title }
    const threadRef = threadFBRef(id)
    const post = { ...findById(state.posts, thread.posts[0]), text }
    const postRef = postFBRef(thread.posts[0])
    batch.update(threadRef, thread)
    batch.update(postRef, post)
    await batch.commit()
    const newThread = await threadRef.get()
    const newPost = await postRef.get()
    console.log({ ...newPost })
    commit('setItem', { resource: 'threads', item: newThread })
    commit('setItem', { resource: 'posts', item: newPost })
    return docToResource(newThread)
  },
  updateUser (context, userToUpdate) {
    context.commit('setItem', { resource: 'users', item: userToUpdate })
  },
  async updatePost ({ commit, state }, { text, id }) {
    const post = {
      ...findById(state.posts, id),
      text,
      edited: {
        at: firebase.firestore.FieldValue.serverTimestamp(),
        by: state.authId,
        moderated: false
      }
    }
    const postRef = postFBRef(id)
    postRef.update(post)
    const newPost = await postRef.get()
    commit('setItem', { resource: 'posts', item: newPost })
  },
  fetchCategory: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'categories', id }),
  fetchForum: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'forums', id }),
  fetchThread: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'threads', id }),
  fetchPost: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'posts', id }),
  fetchUser: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'users', id }),
  fetchAuthUser: ({ dispatch, state }) =>
    dispatch('fetchItem', { resource: 'users', id: state.authId }),
  unsubscribeAllSnapshots ({ state, commit }) {
    state.unsubscribes.forEach((unsubscribe) => unsubscribe())
    commit('clearAllUnsubscribes')
  },
  fetchItem ({ commit }, { resource, id }) {
    return new Promise((resolve) => {
      const unsubscribe = firebase
        .firestore()
        .collection(resource)
        .doc(id)
        .onSnapshot((doc) => {
          const item = { ...doc.data(), id: doc.id }
          commit('setItem', { resource, item })
          resolve(item)
        })
      commit('appendUnsubscribe', { unsubscribe })
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
}
