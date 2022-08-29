<template lang="html">

  <div class="user-info">
      <a href="profile.html#profile-details" class="user-name">{{user.name}}</a>

      <a href="profile.html#profile-details">
          <img class="avatar-large" :src="user.avatar" alt="">
      </a>

      <!-- <p class="desktop-only text-small">{{postsByUser(user.id)}} posts</p> -->

      <!-- <p class="desktop-only text-small">{{threadsByUser(user.id)}} threads</p> -->

      <span class="online desktop-only">online</span>

  </div>

</template>

<script lang="js">

export default {
  name: 'user-info',
  props: ['user'],
  mounted () {

  },
  data () {
    return {

    }
  },
  methods: {
    // postsByUser (userId) {
    //   return this.posts.filter(p => p.userId === userId).length
    // },
    // threadsByUser (userId) {
    //   return this.threads.filter(t => t.userId === userId).length
    // }
  },
  computed: {

  }
}

</script>

<style scoped lang="css">
  .user-info {

  }
</style>
