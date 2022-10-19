<template lang="html">
  <div class="forum-list">
    <div class="forum-listing" v-for="forum in forums" :key="forum.id">
      <div class="forum-details">
        <router-link
          :to="{ name: 'Forum', params: { id: forum.id } }"
          class="text-xlarge"
          >{{ forum.name }}</router-link
        >
        <p>{{ forum.description }}</p>
      </div>

      <div class="threads-count">
        <p>
          <span class="count">{{ forum.threads?.length }}</span>
        </p>
      </div>

      <last-thread :forum="forum" />
    </div>
  </div>
</template>

<script lang="js">
import LastThread from './LastThread.vue'
import { mapActions } from 'vuex'

export default {
  name: 'forum-list',
  props: {
    forums: {
      required: true,
      type: Array
    },
    title: {
      type: String
    }
  },
  methods: {
    ...mapActions(['fetchThreads', 'fetchUser']),
    getThreadsPerForum (forum) {
      return forum.threads ? forum.threads.length : 0
    },
    getThreadCount (forum) {
      const threads = this.getThreadsPerForum(forum)
      return threads || 'No'
    },
    getThreadCountText (forum) {
      return this.getThreadsPerForum(forum) === 1 ? 'thread' : 'threads'
    },
    getThreadsWord (forum) {
      let word = 'thread'
      const threadsCount = this.getThreadsPerForum(forum)
      if (threadsCount) {
        word += threadsCount > 1 ? 's' : ''
      } else {
        word = 'no ' + word + 's'
      }
      return word
    },
    async getLastThread (forumId) {
      return this.lastThreads.find(t => t?.forumId === forumId)
    }
  },
  components: { LastThread }
}
</script>
