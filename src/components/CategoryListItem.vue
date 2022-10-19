<template lang="html">
  <div>
    <h2 class="list-title">
      <router-link
        v-if="category.id"
        :to="{ name: 'Category', params: { id: category.id } }"
      >
        {{ category.name }}</router-link
      >
      <span v-else>{{ category.name }}</span>
    </h2>
    <forum-list
      v-if="forums(category.id).length === category.forums.length"
      :forums="forums(category.id)"
      :title="category.name"
      :categoryId="category.id"
    />
  </div>
</template>

<script lang="js">
import ForumList from './ForumList.vue'

export default {
  name: 'category-list-item',
  props: {
    category: {
      required: true,
      type: Object
    }
  },
  methods: {
    forums (categoryId) {
      return this.$store.state.forums.filter(f => f.categoryId === categoryId)
    }
  },
  components: { ForumList }
}
</script>
