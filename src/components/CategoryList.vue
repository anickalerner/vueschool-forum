<template lang="html">
  <div
    class="category-list col-full"
    v-for="category in categories"
    :key="'category' + category.id"
  >
    <CategoryListItem :category="category" />
  </div>
</template>

<script lang="js">
import CategoryListItem from './CategoryListItem.vue'

export default {
  name: 'category-list',
  props: {
    categories: {
      required: true,
      type: Array
    }
  },
  components: { CategoryListItem }

}
</script>
