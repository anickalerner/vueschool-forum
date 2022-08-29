<template lang="html">
  <h1 class="col-full push-top">Welcome to the Forum</h1>
  <category-list :categories="categories" />
</template>

<script lang="js">
import CategoryList from '@/components/CategoryList.vue'

export default {
  name: 'page-home',
  components: { CategoryList },
  props: [],
  mounted () {
  },
  methods: {
  },
  computed: {
    categories () {
      return this.$store.state.categories
    }
  }
}
</script>

<style scoped lang="css"></style>
