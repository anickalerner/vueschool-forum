<template lang="html">
  <div v-if="asyncDataStatus_ready" class="container">
    <h1 class="col-full push-top">Welcome to the Forum</h1>
    <category-list :categories="categories" />
  </div>
</template>

<script lang="js">
import CategoryList from '@/components/CategoryList.vue'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus.js'
export default {
  name: 'page-home',
  components: { CategoryList },
  mixins: [asyncDataStatus],
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
    categories.forEach(async category =>
      await this.fetchForums({ ids: category.forums })
    )
    this.asyncDataStatus_fetched()
  }
}
</script>

<style scoped lang="css"></style>
