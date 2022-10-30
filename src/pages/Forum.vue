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
      <v-pagination
        v-model="page"
        :pages="totalPages"
        :range-size="1"
        active-color="#57AD8D"
        @update:modelValue="updateHandler"
      />
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
  data () {
    return { page: parseInt(this.$route.query.page) || 1, perPage: 5 }
  },
  watch: {
    async page (page) {
      this.$router.push({ query: { page } })
      // this.getThreads(page)
    }
  },
  methods: {
    ...mapActions({ fetchForum: 'forums/fetchForum', fetchThreadsByPage: 'threads/fetchThreadsByPage', fetchUsers: 'users/fetchUsers' }),
    async getThreads (page) {
      const threads = await this.fetchThreadsByPage({ ids: this.forum.threads, page, perPage: this.perPage })
      const threadIds = threads.map(thread => thread?.userId)
      await this.fetchUsers({ ids: threadIds })
    },
    updateHandler (page) { }
  },
  computed: {
    ...mapGetters({ threadById: 'threads/threadById' }),
    forum () {
      return findById(this.$store.state.forums.items, this.id)
    },
    threads () {
      if (!this.forum) return []
      return this.$store.state.threads.items.filter(thread => thread.forumId === this.forum.id).map(thread => this.threadById(thread.id))
    },
    threadsCount () {
      return this.forum.threads.length
    },
    totalPages () {
      if (!this.threadsCount) return 0
      return Math.ceil(this.threadsCount / this.perPage)
    }
  },
  async created () {
    await this.fetchForum({ id: this.id })
    this.getThreads(this.page)
    this.asyncDataStatus_fetched()
  }

}
</script>

<style scoped lang="css"></style>
