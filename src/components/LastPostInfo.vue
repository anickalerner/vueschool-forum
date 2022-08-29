<template lang="html">
  <div>
    <img class="avatar-medium" :src="user.avatar" alt="" />

    <div>
      <p class="text-xsmall">
        <a href="profile.html">{{ user.name }}</a>
      </p>
      <p class="text-xsmall text-faded">{{ timeFrom(post.publishedAt) }}</p>
    </div>
  </div>
</template>

<script lang="js">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export default {
  name: 'last-post-info',
  props: ['post'],
  mounted () {

  },
  data () {
    return {
    }
  },
  methods: {
    timeFrom (timestamp) {
      return dayjs.unix(timestamp).fromNow()
    }
  },
  computed: {
    user () {
      return this.users.find(u => u.id === this.post.userId)
    },
    users () {
      return this.$store.state.users
    }
  }
}
</script>

<style scoped lang="css"></style>
