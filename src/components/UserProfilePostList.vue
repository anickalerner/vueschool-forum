<template lang="html">
  <div>
    <div
    class="activity-list"
    v-for="post in posts"
    :key="post"
    :data-id="post"
    >
    <UserProfilePostItem :post="post" :user="user" />
  </div>
</div>
</template>

<script lang="js">
import UserProfilePostItem from './UserProfilePostItem.vue'
export default {
  name: 'user-profile-post-list',
  props: {
    posts: {
      type: Array
    },
    user: { type: Object }
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
  }
}
</script>

<style scoped lang="css">
.post-list {
  margin-top: 20px;
}
</style>
