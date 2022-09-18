<template lang="html">
  <div class="col-full push-top">
    <h1>
      Create new thread in
      <i>
        {{ forum.name }}
      </i>
    </h1>
    <ThreadEditor @cancel="backToForum" @save="save" />
  </div>
</template>

<script lang="js">
import { mapGetters, mapActions } from 'vuex'
import ThreadEditor from '../components/ThreadEditor.vue'
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

    }
  },
  methods: {
    async save ({ title, text }) {
      // dispatch save action
      const thread = await this.$store.dispatch('createThread', { title, text, forumId: this.forumId })
      this.$router.push({ name: 'ThreadShow', params: { id: thread.id } })
    },
    backToForum () {
      this.$router.push({ name: 'Forum', params: { id: this.forumId } })
    },
    ...mapActions('fetchForum')
  },
  computed: {
    ...mapGetters({ forumById: 'forumById' }),
    forum () {
      return this.forumById(this.forumId) || {}
    }
  },
  components: { ThreadEditor },
  created () {
    this.fetchForum({ id: this.forumId })
  }
}
</script>

<style scoped lang="css">
.thread-create {
}
</style>
