import { createStore } from 'vuex'
import sourceData from '@/data'
import { findById } from '@/helpers'

export default createStore({
  state: {
    ...sourceData,
    authId: '7uVPJS9GHoftN58Z2MXCYDqmNAh2'
  },
  getters: {
    authUser: (state) => {
      const user = findById(state.users, state.authId)
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
    },
    forumById: (state) => (forumId) => {
      return state.forums.find((forum) => forum.id === forumId)
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
      commit('setPost', { post })
      commit('appendPostToThread', {
        postId: post.id,
        threadId: post.threadId
      })
      return post
    },
    async createThread ({ commit, state, dispatch }, { title, text, forumId }) {
      const createdTimeStamp = Math.floor(Date.now() / 1000)
      const slug = this.getters.titleToSlug(title)
      const thread = {
        contributors: [],
        firstPostId: '',
        forumId: forumId,
        lastPostAt: createdTimeStamp,
        lastPostId: '',
        posts: [],
        publishedAt: createdTimeStamp,
        slug,
        title,
        userId: state.authId
      }
      commit('setThread', { thread })
      const firstPost = {
        text: text,
        threadId: thread.id,
        publishedAt: createdTimeStamp
      }
      const newPost = await dispatch('createPost', firstPost)
      thread.lastPostId = newPost.id
      thread.firstPostId = newPost.id
      commit('appendThreadToForum', { thread })
      return thread
    },
    updateThread ({ commit, state }, { title, text, id }) {
      const thread = { ...state.threads.find((t) => t.id === id), title }
      commit('setThread', { thread })
      const post = { ...thread.posts[0], text }
      commit('setPost', { post })
    },
    updateUser (context, userToUpdate) {
      context.commit('setUser', { userToUpdate })
    }
  },
  mutations: {
    setPost (state, { post }) {
      const ind = state.posts.findIndex((p) => p.id === post.id)
      if (post.id && ind > -1) {
        state.posts[ind] = { ...post }
      } else {
        post.id = 'ppp' + Math.random()
        state.posts.push(post)
      }
    },
    setThread (state, { thread }) {
      const ind = state.threads.findIndex((t) => t.id === thread.id)
      if (thread.id && ind > -1) {
        state.threads[ind] = thread
      } else {
        thread.id = 'ttt' + Math.random()
        state.threads.push(thread)
      }
    },
    setUser (state, { userToUpdate }) {
      const ind = state.users.findIndex((user) => user.id === userToUpdate.id)
      state.users[ind] = userToUpdate
    },
    appendPostToThread (state, { postId, threadId }) {
      const thread = state.threads.find((thread) => thread.id === threadId)
      thread.posts = thread.posts || []
      thread.posts.push(postId)
    },
    appendThreadToForum (state, { thread }) {
      const forum = state.forums.find((forum) => forum.id === thread.forumId)
      forum.threads = forum.threads || []
      forum.threads.push(thread.id)
    }
  }
})
