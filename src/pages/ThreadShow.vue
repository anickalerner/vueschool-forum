<template lang="html">
  <div class="col-large push-top">
    <h1>{{ thread.title }}
    <router-link :to="{name: 'ThreadEdit', id: this.id }" class="btn-small btn-green">
      Edit thread
    </router-link></h1>

    <p>
      By <a href="#" class="link-unstyled">{{ userById(thread.userId).name }}</a
      >, <app-date :timestamp="thread.publishedAt" />.
      <!-- <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">3 replies by 3 contributors</span> -->
    </p>
    <post-list :posts="threadPosts" />
    <post-editor @save="addPost" />
  </div>
</template>

<script lang="js">
import PostList from '@/components/PostList.vue'
import PostEditor from '@/components/PostEditor.vue'

export default {
  name: 'page-thread-show',
  components: { PostList, PostEditor },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  mounted () {

  },
  methods: {
    userById (userId) {
      return this.users.find(u => u.id === userId)
    },
    addPost (eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id
      }
      this.$store.dispatch('createPost', post)
    }
  },
  computed: {
    threads () {
      return this.$store.state.threads
    },
    posts () {
      return this.$store.state.posts
    },
    users () {
      return this.$store.state.users
    },
    thread () {
      return this.$store.state.threads.find(t => t.id === this.id)
    },
    threadPosts () {
      return this.$store.state.posts.filter(p => p.threadId === this.id)
    }

  }
}
</script>

<style scoped lang="css"></style>
