<template lang="html">
  <div v-if="thread.id">
    <p>
      <router-link :to="{ name: 'ThreadShow', params: { id: thread.id } }">
        {{ thread.title }}
      </router-link>
    </p>
    <p class="text-faded text-xsmall">
      By <a href="#">{{ userById(thread.userId).name }}</a
      >, <app-date :timestamp="thread.publishedAt" />.
    </p>
  </div>

  <div class="activity" v-if="thread">
    <p class="replies-count">{{ thread.repliesCount }} replies</p>
    <last-post-info :post="lastPost(thread.id)" />
  </div>
</template>

<script lang="js">
import LastPostInfo from '@/components/LastPostInfo.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { findById } from '@/helpers'
dayjs.extend(relativeTime)

export default {
  name: 'thread-list-item',
  props: {
    thread: {
      type: Object,
      required: true
    }
  },
  components: { LastPostInfo },
  methods: {
    userById (userId) {
      return findById(this.users, userId) || {}
    },
    lastPost (threadId) {
      return this.posts.filter(p => p.threadId === threadId).sort((a, b) => b.publishedAt - a.publishedAt)[0]
    },
    timeFrom (timestamp) {
      return dayjs.unix(timestamp).fromNow()
    }

  },
  computed: {
    users () {
      if (!this.thread) return []
      return this.$store.state.users.items
    },
    posts () {
      if (!this.thread) return []
      return this.$store.state.posts.items
    }
  },
  async created () {
    await this.$store.dispatch('users/fetchUsers', { ids: this.thread.contributors })
    await this.$store.dispatch('posts/fetchPosts', { ids: this.thread.posts })
  }
}
</script>

<style scoped lang="css"></style>
