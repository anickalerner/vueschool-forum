<template lang="html">
  <div class="flex-grid" v-if="user">
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
        :user="user"
      />
      <AppInfiniteScroll @load="fetchUserPosts" :done="user.posts.length === user.postsCount"/>
    </div>
  </div>
</template>

<script lang="js">
import { mapGetters } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import UserProfileCard from '../components/UserProfileCard.vue'
import UserProfileCardEditor from '@/components/UserProfileCardEditor.vue'
import UserProfilePostList from '@/components/UserProfilePostList.vue'
import AppInfiniteScroll from '@/components/AppInfiniteScroll.vue'
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
    ...mapGetters({ user: 'auth/authUser' }),
    startAfter () {
      if (this.user.posts.length === 0) return null
      return this.user.posts[this.user.posts.length - 1]
    }
  },
  methods: {
    fetchUserPosts () {
      this.$store.dispatch('auth/fetchAuthUserPosts', { startAfter: this.startAfter })
    }
  },
  async created () {
    await this.fetchUserPosts()
    this.asyncDataStatus_fetched()
  },
  components: { UserProfileCard, UserProfileCardEditor, UserProfilePostList, AppInfiniteScroll }
}
</script>

<style scoped lang="css"></style>
