<template lang="html">
  <div class="col-full">
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>

      <div v-for="thread in threads" :key="thread.id" class="thread">
        <div>
          <p>
            <router-link
              :to="{ name: 'ThreadShow', params: { id: thread.id } }"
            >
              {{ thread.title }}
            </router-link>
          </p>
          <p class="text-faded text-xsmall">
            By <a href="#">{{ userById(thread.userId).name }}</a
            >, <app-date :timestamp="thread.publishedAt" />.
          </p>
        </div>

        <div class="activity">
          <p class="replies-count">{{ thread.posts.length }} replies</p>
          <last-post-info :post="lastPost(thread.id)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import LastPostInfo from '@/components/LastPostInfo.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export default {
  name: 'thread-list',
  props: {
    threads: {
      required: true,
      type: Array
    }
  },
  components: { LastPostInfo },
  mounted () {

  },
  data () {
    return {
    }
  },
  methods: {
    userById (userId) {
      return this.users.find(u => u.id === userId)
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
      return this.$store.state.users
    },
    posts () {
      return this.$store.state.posts
    }
  }
}
</script>

<style scoped lang="css"></style>
