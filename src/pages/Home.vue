<template lang="html">
  <h1 class="col-full push-top">Welcome to the Forum</h1>
  <category-list :categories="categories" />
</template>

<script lang="js">
import CategoryList from '@/components/CategoryList.vue'
import { mapActions } from 'vuex'

export default {
  name: 'page-home',
  components: { CategoryList },
  methods: {
    ...mapActions(['fetchCategories', 'fetchForums'])
  },
  computed: {
    categories () {
      return this.$store.state.categories
    }
  },
  async created () {
    const categories = await this.fetchCategories()
    categories.forEach(category => {
      this.fetchForums({ ids: category.forums })
    })
  }
}
</script>

<style scoped lang="css"></style>
