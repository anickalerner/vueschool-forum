import { userFBRef } from '../helpers'
import firebase from 'firebase'
import router from '@/router'

export default {
  namespaced: true,
  state: {
    authId: null,
    authUserUnsubscribe: null,
    authObserverUnsubscribe: null
  },
  getters: {
    authUser: (state, getters, rootState, rootGetters) => {
      return rootGetters['users/user'](state.authId)
    }
  },
  actions: {
    initAuthentication ({ dispatch, commit, state }) {
      if (state.authObserverUnsubscribe) state.authObserverUnsubscribe()
      return new Promise((resolve) => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          console.log('👣 the user has changed')
          dispatch('unsubscribeAuthSnapshot')
          if (user) {
            await dispatch('fetchAuthUser')
            resolve(user)
          } else {
            resolve(null)
          }
        })
        commit('setAuthObserverUnsubscribe', unsubscribe)
      })
    },
    async registerUserWithEmailAndPassword (
      { dispatch },
      { email, name, username, password, avatar = null }
    ) {
      const result = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
      await dispatch(
        'users/createUser',
        {
          id: result.user.uid,
          email,
          name,
          username,
          avatar
        },
        { root: true }
      )
      await dispatch('fetchAuthUser')
    },
    signInWithEmailAndPassword (context, { email, password }) {
      return firebase.auth().signInWithEmailAndPassword(email, password)
    },
    async signInWithGoogle ({ dispatch }) {
      const provider = new firebase.auth.GoogleAuthProvider()
      const response = await firebase.auth().signInWithPopup(provider)
      const user = response.user
      const userRef = userFBRef(user.uid)
      const userDoc = await userRef.get()
      if (!userDoc.exists) {
        return dispatch(
          'users/createUser',
          {
            id: user.uid,
            name: user.displayName,
            email: user.email,
            username: user.email,
            avatar: user.photoURL
          },
          { root: true }
        )
      }
    },
    async signOut ({ commit }) {
      await firebase.auth().signOut()
      commit('setAuthId', null)
      router.push({ name: 'Home' })
    },
    fetchAuthUser: async ({ dispatch, commit }) => {
      const user = firebase.auth().currentUser
      const userId = user?.uid
      if (!userId) return
      await dispatch(
        'fetchItem',
        {
          resource: 'users',
          id: userId,
          handleUnsubscribe: (unsubscribe) => {
            commit('setAuthUnsubscribe', unsubscribe)
          }
        },
        { root: true }
      )
      commit('setAuthId', userId)
    },
    async fetchAuthUserPosts ({ commit, state }) {
      const posts = await firebase
        .firestore()
        .collection('posts')
        .where('userId', '==', state.authId)
        .get()
      posts.forEach((item) =>
        commit('setItem', { resource: 'posts', item }, { root: true })
      )
    },
    unsubscribeAuthSnapshot ({ state, commit }) {
      if (state.authUserUnsubscribe) {
        state.authUserUnsubscribe()
        commit('setAuthUnsubscribe', null)
      }
    }
  },
  mutations: {
    setAuthId (state, id) {
      state.authId = id
    },
    setAuthUnsubscribe (state, unsubscribe) {
      state.authUserUnsubscribe = unsubscribe
    },
    setAuthObserverUnsubscribe (state, unsubscribe) {
      state.setAuthObserverUnsubscribe = unsubscribe
    }
  }
}
