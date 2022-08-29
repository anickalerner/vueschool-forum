<template lang="html">
  <div class="col-full push-top">
    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <router-link
        :to="{
          name: 'ThreadCreate',
          params: { forumId: id }
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

export default {
  name: 'page-forum',
  props: {
    id: {
      required: true,
      type: String
    }
  },
  mounted () {
  },
  data () {
    return {}
  },
  methods: {},
  computed: {
    forum () {
      return this.$store.state.forums.find(forum => forum.id === this.id)
    },
    threads () {
      return this.$store.state.threads.filter(thread => thread.forumId === this.id)
    }
  },
  components: { ThreadList }
}
</script>

<style scoped lang="css"></style>
