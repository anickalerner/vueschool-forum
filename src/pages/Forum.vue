<template lang="html">
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <router-link
        :to="{
          name: 'ThreadCreate',
          params: { forumId: forum.id }
        }"
        class="btn-green btn-small"
        >Start a thread</router-link
      >
    </div>
    <div class="col-full push-top">
      <ThreadList :threads="threads" />
    </div>
  </div>
</template>

<script lang="js">
import ThreadList from '@/components/ThreadList.vue'
import { findById } from '@/helpers'
import { mapActions, mapGetters } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus.js'

export default {
  components: { ThreadList },
  mixins: [asyncDataStatus],
  name: 'page-forum',
  props: {
    id: {
      required: true,
      type: String
    }
  },
  methods: {
    ...mapActions({ fetchForum: 'forums/fetchForum', fetchThreads: 'threads/fetchThreads', fetchUsers: 'users/fetchUsers' })
  },
  computed: {
    ...mapGetters({ threadById: 'threads/threadById' }),
    forum () {
      return findById(this.$store.state.forums.items, this.id)
    },
    threads () {
      if (!this.forum) return []
      return this.forum.threads.map(threadId => this.threadById(threadId))
    }
  },
  async created () {
    const forum = await this.fetchForum({ id: this.id })
    const threads = await this.fetchThreads({ ids: forum.threads })
    await this.fetchUsers({ ids: threads.map(thread => thread.userId) })
    this.asyncDataStatus_fetched()
  }

}
</script>

<style scoped lang="css"></style>
