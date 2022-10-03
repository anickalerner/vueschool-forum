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
  </div>
  <div class="col-full push-top">
    <ThreadList :threads="threads" />
  </div>
</template>

<script lang="js">
import ThreadList from '@/components/ThreadList.vue'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'
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
    ...mapActions(['fetchForum', 'fetchThreads', 'fetchUsers'])
  },
  computed: {
    forum () {
      return findById(this.$store.state.forums, this.id)
    },
    threads () {
      if (!this.forum) return []
      return this.forum.threads.map(threadId => this.$store.getters.threadById(threadId))
    }
  },
  async created () {
    console.log('ready:', this.asyncDataStatus_ready)
    const forum = await this.fetchForum({ id: this.id })
    const threads = await this.fetchThreads({ ids: forum.threads })
    await this.fetchUsers({ ids: threads.map(thread => thread.userId) })
    this.asyncDataStatus_fetched()
    console.log('ready:', this.asyncDataStatus_ready)
  }

}
</script>

<style scoped lang="css"></style>
