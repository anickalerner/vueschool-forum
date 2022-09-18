<template lang="html">
  <div class="col-large push-top" v-if="thread">
    <h1>
      {{ thread.title }}
      <router-link
        :to="{ name: 'ThreadEdit', id: this.id }"
        class="btn-small btn-green"
      >
        Edit thread
      </router-link>
    </h1>
    <p>
      By <a href="#" class="link-unstyled">{{ thread.author?.name }}</a
      >, <app-date :timestamp="thread?.publishedAt" />.
      <span
        style="float: right; margin-top: 2px"
        class="hide-mobile text-faded text-small"
        >{{ thread.repliesCount }} replies by
        {{ thread.contributorsCount }} contributors</span
      >
    </p>
    <post-list :posts="threadPosts" />
    <post-editor @save="addPost" />
  </div>
</template>

<script lang="js">
import PostList from '@/components/PostList.vue'
import PostEditor from '@/components/PostEditor.vue'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'
export default {
  name: 'page-thread-show',
  components: { PostList, PostEditor },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  methods: {
    userById (userId) {
      return findById(this.users, userId)
    },
    addPost (eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id
      }
      this.$store.dispatch('createPost', post)
    },
    ...mapActions(['fetchThread', 'fetchUser', 'fetchPosts', 'fetchUsers'])
  },
  computed: {
    posts () {
      return this.$store.state.posts
    },
    users () {
      return this.$store.state.users
    },
    thread () {
      return this.$store.getters.threadById(this.id)
    },
    threadPosts () {
      return this.posts.filter(p => p.threadId === this.id)
    }
  },
  async created () {
    const thread = await this.fetchThread({ id: this.id })
    // fetch the user
    await this.fetchUser({ id: thread.userId })
    // fetch the posts
    const posts = await this.fetchPosts({ ids: thread.posts })
    const users = posts.map(post => post.userId)
    this.fetchUsers({ ids: users })
  }
}
</script>

<style scoped lang="css"></style>
