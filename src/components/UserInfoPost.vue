<template lang="html">
  <div class="user-info" v-if="user">
    <a href="profile.html#profile-details" class="user-name">{{ user.name }}</a>

    <a href="profile.html#profile-details">
      <img class="avatar-large" :src="user.avatar" alt="" />
    </a>

    <p class="desktop-only text-small">{{ user.postsCount }} posts</p>

    <p class="desktop-only text-small">{{ user.threadsCount }} threads</p>

    <span class="online desktop-only">online</span>
  </div>
</template>

<script lang="js">

export default {
  name: 'user-info',
  props: ['user']
}
</script>

<style scoped lang="css">
.user-info {
}
</style>
