<template lang="html">
  <div class="col-full push-top">
    <h1>Edit thread {{ thread.title }}
    </h1>
    <ThreadEditor
      :title="thread.title"
      :text="text"
      @cancel="backToThread"
      @save="save"
    />
  </div>
</template>

<script lang="js">
import ThreadEditor from '../components/ThreadEditor.vue'
export default {
  name: 'thread-edit',
  props: {
    id: {
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
      await this.$store.dispatch('updateThread', { title, text, id: this.id })
      this.backToThread()
    },
    backToThread () {
      this.$router.push({ name: 'ThreadShow', params: { id: this.id } })
    }
  },
  computed: {
    thread () {
      return this.$store.state.threads.find(t => t.id === this.id)
    },
    text () {
      return this.$store.state.posts.find(p => p.id === this.thread.posts[0]).text
    }
  },
  components: { ThreadEditor }
}
</script>

<style scoped lang="css"></style>
