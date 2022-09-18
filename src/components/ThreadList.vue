<template lang="html">
  <div v-if="threads && threads.length > 0" class="col-full">
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>
      <div v-for="thread in threads" :key="thread.id" class="thread">
        <thread-list-item :thread="thread" />
      </div>
    </div>
  </div>
</template>

<script lang="js">
import ThreadListItem from '@/components/ThreadListItem.vue'
export default {
  name: 'thread-list',
  props: {
    threads: {
      required: true,
      type: Array
    }
  },
  components: { ThreadListItem },
  computed: {
    firstId () {
      return this.threads[0].id
    }
  }
}
</script>

<style scoped lang="css"></style>
