<template lang="html">
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>
      Create new thread in
      <i>
        {{ forum.name }}
      </i>
    </h1>
    <ThreadEditor
      @save="save"
      @cancel="cancel"
      @dirty="formIsDirty = true"
      @clean="formIsDirty = false"
    />
  </div>
</template>

<script lang="js">
import { mapGetters, mapActions } from 'vuex'
import ThreadEditor from '../components/ThreadEditor.vue'
import asyncDataStatus from '@/mixins/asyncDataStatus.js'

export default {
  name: 'thread-create',
  props: {
    forumId: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      formIsDirty: false
    }
  },
  components: { ThreadEditor },
  mixins: [asyncDataStatus],
  methods: {
    async save ({ title, text }) {
      // dispatch save action
      const thread = await this.$store.dispatch('createThread', { title, text, forumId: this.forumId })
      this.$router.push({ name: 'ThreadShow', params: { id: thread.id } })
    },
    cancel () {
      this.$router.push({ name: 'Forum', params: { id: this.forumId } })
    },
    ...mapActions(['fetchForum', 'createThread'])
  },
  computed: {
    ...mapGetters({ forumById: 'forumById' }),
    forum () {
      return this.forumById(this.forumId) || {}
    }
  },
  async created () {
    await this.fetchForum({ id: this.forumId })
    this.asyncDataStatus_fetched()
  },
  beforeRouteLeave () {
    if (this.formIsDirty) {
      const confirmed = window.confirm('Are you sure you want to leave? Unsaved changes will be lost')
      if (!confirmed) return false
    }
  }
}
</script>

<style scoped lang="css">
.thread-create {
}
</style>
