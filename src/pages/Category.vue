<template lang="html">
  <div class="col-full push-top">
    <h1>{{ category.name }}</h1>
  </div>

  <div class="col-full">
    <ForumList
      :forums="forums"
      :title="category.name"
      :categoryId="category.id"
    />
  </div>
</template>

<script lang="js">
import ForumList from '@/components/ForumList.vue'

export default {
  name: 'category-page',
  components: { ForumList },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  mounted () {

  },
  data () {
    return {

    }
  },
  methods: {

  },
  computed: {
    category () {
      return this.$store.state.categories.find(c => c.id === this.id)
    },
    forums () {
      return this.$store.state.forums.filter(f => f.categoryId === this.id)
    }
  }
}
</script>

<style scoped lang="css">
.category {
}
</style>
