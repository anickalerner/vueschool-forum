<template lang="html">
  <div v-if="asyncDataStatus_ready" class="container">
    <h1 class="col-full push-top">Welcome to the Forum</h1>
    {{ categories.length }}
    <category-list v-if="categories.length > 0" :categories="categories" />
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
    ...mapActions('categories', ['fetchCategories']),
    ...mapActions('forums', ['fetchForums'])
  },
  computed: {
    categories () {
      return this.$store.state.categories.items
    }
  },
  async created () {
    const categories = await this.fetchCategories()
    categories.forEach(async category => {
      await this.fetchForums({ ids: category.forums })
    })
    this.asyncDataStatus_fetched()
  }
}
</script>

<style scoped lang="css"></style>
