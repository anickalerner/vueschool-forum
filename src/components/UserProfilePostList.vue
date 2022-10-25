<template lang="html">
  <div
    class="activity-list"
    v-for="post in postsList"
    :key="post.id"
    :data-id="post.id"
  >
    <UserProfilePostItem :post="post" :userName="userName" />
  </div>
</template>

<script lang="js">
import UserProfilePostItem from './UserProfilePostItem.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'user-profile-post-list',
  props: {
    posts: {
      type: Array
    },
    userName: { type: String }
  },
  data () {
    return {
      editing: null,
      postsList: []
    }
  },
  components: { UserProfilePostItem },
  methods: {
    toggleEditMode (id) {
      this.editing = this.editing === id ? null : id
    },
    editPost ({ post }) {
      this.updatePost(post)
      this.toggleEditMode(post.id)
    }
  },
  computed: {
    ...mapGetters({ threadsByUser: 'threads/threadsByUser' })
  },
  async created () {
    const threads = this.posts.map(p => p.threadId)
    await this.$store.dispatch('threads/fetchThreads', { ids: threads })
    const userThreads = this.threadsByUser(this.posts[0].userId)
    const firstPostsId = userThreads.map(t => t.posts[0])
    this.postsList = this.posts.map(post => {
      const isFirstPost = firstPostsId.includes(post.id)
      const p = { ...post, thread: userThreads.find(t => t.id === post.threadId), isFirstPost }
      return p
    })
  }
}
</script>

<style scoped lang="css">
.post-list {
  margin-top: 20px;
}
</style>
