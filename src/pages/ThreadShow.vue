<template lang="html">
  <div class="col-large push-top" v-if="asyncDataStatus_ready">
    <h1>
      {{ thread.title }}
      <router-link
        v-if="isOwnThread"
        :to="{ name: 'ThreadEdit', id: this.id }"
        class="btn-small btn-green"
      >
        Edit thread
      </router-link>
    </h1>
    <p>
      <a @click.prevent="createNotification()">Add notification</a><br />
      <a @click.prevent="deleteNotification()">Remove notification</a>
    </p>
    <p>
      By <a href="#" class="link-unstyled">{{ thread.author?.name }}</a
      >,
      <!-- <app-date :timestamp="thread?.publishedAt" /> -->
      <span
        style="float: right; margin-top: 2px"
        class="hide-mobile text-faded text-small"
        >{{ thread.repliesCount }} replies by
        {{ thread.contributorsCount }} contributors</span
      >
    </p>
    <post-list :posts="threadPosts" />
    <post-editor v-if="authUser" @save="addPost" />
    <div v-else class="text-center" style="margin-bottom: 50px">
      <router-link :to="{ name: 'SignIn', query: { redirectTo: $router.path } }"
        >Sign in</router-link
      >
      or
      <router-link
        :to="{ name: 'Register', query: { redirectTo: $router.path } }"
        >Register</router-link
      >
      to reply
    </div>
  </div>
</template>

<script lang="js">
import PostList from '@/components/PostList.vue'
import PostEditor from '@/components/PostEditor.vue'
import { mapActions, mapGetters } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus.js'
import useNotification from '@/composables/useNotifications.js'
import difference from 'lodash/difference'

export default {
  name: 'page-thread-show',
  components: { PostList, PostEditor },
  mixins: [asyncDataStatus],
  props: {
    id: {
      required: true,
      type: String
    }
  },
  setup () {
    const { addNotification, removeEldestNotification } = useNotification()
    return { addNotification, removeEldestNotification }
  },
  methods: {
    ...mapActions({ createPost: 'posts/createPost', fetchThread: 'threads/fetchThread', fetchPosts: 'posts/fetchPosts', fetchUsers: 'users/fetchUsers' }),
    addPost (eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id
      }
      this.createPost(post)
    },
    createNotification () {
      this.addNotification({ message: Math.random() + ' some text' })
    },
    deleteNotification () {
      this.removeEldestNotification()
    },
    async fetchUsersAndPosts (postIds) {
      const posts = await this.fetchPosts({
        ids: postIds,
        onSnapshot: ({ previousItem }) => {
          if (!this.asyncDataStatus_ready || (previousItem?.edited && !previousItem?.edited?.at)) return
          this.addNotification({ message: 'Thread was updated', timeout: 5000 })
        }
      })
      const users = posts.map(post => post.userId).concat(this.thread.userId)
      await this.fetchUsers({ ids: users })
    }
  },
  computed: {
    ...mapGetters({ authUser: 'auth/authUser', threadById: 'threads/threadById' }),
    posts () {
      return this.$store.state.posts.items
    },
    users () {
      return this.$store.state.users.items
    },
    thread () {
      return this.threadById(this.id)
    },
    threadPosts () {
      return this.posts.filter(p => p.threadId === this.id)
    },
    isOwnThread () {
      return this.thread.userId === this.authUser?.id
    }
  },
  async created () {
    const thread = await this.fetchThread({
      id: this.id,
      onSnapshot: async ({ item, previousItem, isLocal }) => {
        if (!this.asyncDataStatus_ready || isLocal) return
        const newPosts = difference(previousItem.posts, item.posts)
        if (newPosts.length > 0) {
          await this.fetchUsersAndPosts(newPosts)
        } else {
          this.addNotification({ message: 'Thread was updated', timeout: 3000 })
        }
      }
    })
    await this.fetchUsersAndPosts(thread.posts)
    this.asyncDataStatus_fetched()
  }
}
</script>

<style scoped lang="css"></style>
