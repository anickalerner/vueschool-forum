<template lang="html">
  <div class="flex-grid">
    <div class="col-3 push-top">
      <UserProfileCard v-if="!edit" :user="user" />
      <UserProfileCardEditor v-else :user="user" />
    </div>

    <div class="col-7 push-top">
      <div class="profile-header">
        <span class="text-lead"> {{ user.name }} recent activity </span>
        <a href="#">See only started threads?</a>
      </div>

      <hr />
      <UserProfilePostList
        v-if="user && user.posts && user.posts.length > 0"
        :posts="user.posts"
        :userName="user.name"
      />
    </div>
  </div>
</template>

<script lang="js">
import { mapGetters } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import UserProfileCard from '../components/UserProfileCard.vue'
import UserProfileCardEditor from '@/components/UserProfileCardEditor.vue'
import UserProfilePostList from '@/components/UserProfilePostList.vue'

export default {
  name: 'profile-page',
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  mixins: [asyncDataStatus],
  computed: {
    ...mapGetters({ user: 'authUser' })
  },
  async created () {
    await this.$store.dispatch('fetchAuthUserPosts')
    this.asyncDataStatus_fetched()
  },
  components: { UserProfileCard, UserProfileCardEditor, UserProfilePostList }
}
</script>

<style scoped lang="css"></style>
