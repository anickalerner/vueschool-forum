<template lang="html">
  <div class="profile-card">
    <p class="text-center">
      <img
        :src="user.avatar"
        :alt="'{{user.name}} profile picture'"
        class="avatar-xlarge"
      />
    </p>

    <h1 class="title">{{ user.username }}</h1>

    <p class="text-lead">{{ user.name }}</p>

    <p class="text-justify">{{ bio }}</p>

    <span class="online">{{ user.username }} is online</span>

    <div class="stats">
      <span>{{ user.postsCount }} posts</span>
      <span>{{ user.threadsCount }} threads</span>
    </div>

    <hr />

    <p class="text-large text-center" v-if="user.website">
      <i class="fa fa-globe"></i> <a href="#">{{ user.website }}</a>
    </p>
  </div>
  <p class="text-xsmall text-faded text-center">
    Member since
    <app-date :timestamp="user.registeredAt" />
    , last visited 4 hours ago
    <!-- <AppDate :timestamp="user.lastVisitAt" /> -->
  </p>

  <div class="text-center">
    <hr />
    <router-link :to="{ name: 'ProfileEdit' }" class="btn-green btn-small"
      >Edit Profile</router-link
    >
  </div>
</template>

<script lang="js">
export default {
  name: 'user-profile-card',
  props: {
    user: {
      required: true,
      type: Object
    }
  },
  computed: {
    bio () {
      return this.user.bio || 'No bio specified.'
    }
  }
}
</script>
