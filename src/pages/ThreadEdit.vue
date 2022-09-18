<template lang="html">
  <div class="col-full push-top" v-if="thread">
    <h1>Edit thread {{ title }}</h1>
    <ThreadEditor
      v-if="firstPost"
      :title="title"
      :text="text"
      @cancel="backToThread"
      @save="save"
    />
  </div>
</template>

<script lang="js">
import ThreadEditor from '../components/ThreadEditor.vue'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'

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
    },
    ...mapActions(['fetchThread', 'fetchPost'])
  },
  computed: {
    thread () {
      return findById(this.$store.state.threads, this.id)
    },
    firstPost () {
      if (!this.thread) return {}
      return findById(this.$store.state.posts, this.thread.posts[0])
    },
    title () {
      return this.thread ? this.thread.title : ''
    },
    text () {
      return this.firstPost ? this.firstPost.text : ''
    }
  },
  components: { ThreadEditor },
  async created () {
    const thread = await this.fetchThread({ id: this.id })
    this.fetchPost({ id: thread.posts[0] })
  }

}
</script>

<style scoped lang="css"></style>
