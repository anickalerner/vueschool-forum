<template lang="html">
  <div class="last-thread" v-if="thread && author">
    <img class="avatar" :src="author.avatar" alt="" />
    <div class="last-thread-details">
      <router-link :to="{ name: 'ThreadShow', params: { id: thread.id } }">
        Post Reactions
      </router-link>
      <p class="text-xsmall">
        By <a href="profile.html">{{ author.name }}</a
        >,
        <AppDate :timestamp="thread.publishedAt" />
      </p>
    </div>
  </div>
</template>

<script lang="js">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedDate from 'dayjs/plugin/localizedFormat'
import { mapActions } from 'vuex'
import AppDate from './AppDate.vue'
dayjs.extend(relativeTime)
dayjs.extend(localizedDate)

export default {
  name: 'last-thread',
  props: {
    forum: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      lastThread: null
    }
  },
  computed: {
    thread () {
      return this.lastThread?.thread
    },
    author () {
      return this.lastThread?.author
    }
  },
  components: { AppDate },
  methods: {
    ...mapActions({ fetchThreads: 'threads/fetchThreads', fetchUser: 'users/fetchUser' }),
    humanFriendlyDate (timestamp) {
      const normalizedTimestamp = timestamp?.seconds || timestamp
      return dayjs.unix(normalizedTimestamp).format('llll')
    }
  },
  async created () {
    const threads = await this.fetchThreads({ ids: this.forum.threads })
    this.lastThread = { forumId: this.forum.id }
    const thread = threads.sort((t1, t2) => t2.lastPostAt - t1.lastPostAt)[0]
    if (thread) {
      const author = await this.fetchUser({ id: thread.userId })
      this.lastThread = { ...this.lastThread, thread, author }
    }
  }
}
</script>

<style scoped lang="css"></style>
