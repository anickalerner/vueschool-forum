<template lang="html">
  <div v-if="post">
    <img class="avatar-medium" :src="user.avatar" alt="" />

    <div>
      <p class="text-xsmall">
        <a href="profile.html">{{ user.name }}</a>
      </p>
      <p class="text-xsmall text-faded">
        <app-date :timestamp="post.publishedAt" />
      </p>
    </div>
  </div>
</template>

<script lang="js">
import { findById } from '@/helpers'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export default {
  name: 'last-post-info',
  props: ['post'],
  computed: {
    user () {
      return findById(this.users, this.post.userId)
    },
    users () {
      return this.$store.state.users
    }
  }
}
</script>

<style scoped lang="css"></style>
