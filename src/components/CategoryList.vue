<template lang="html">
  <div
    class="category-list col-full"
    v-for="category in categories"
    :key="'category' + category.id"
  >
    <forum-list
      :forums="getForums(category.id)"
      :title="category.name"
      :categoryId="category.id"
    />
  </div>
</template>

<script lang="js">
import ForumList from './ForumList.vue'

export default {
  name: 'category-list',
  props: {
    categories: {
      required: true,
      type: Array
    }
  },
  mounted () {
  },
  data () {
    return {}
  },
  methods: {
    getForums (categoryId) {
      return this.$store.state.forums.filter(f => f.categoryId === categoryId)
    }
  },
  computed: {},
  components: { ForumList }
}
</script>

<style scoped lang="css">
.forum-list {
}
</style>
