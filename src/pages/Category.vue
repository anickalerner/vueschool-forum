<template lang="html">
  <div v-if="category">
    <div class="col-full push-top">
      <h1>{{ category.name }}</h1>
    </div>

    <div class="col-full">
      <ForumList
        :forums="forums"
        :title="category.name || ''"
        :categoryId="category.id || ''"
      />
    </div>
  </div>
</template>

<script lang="js">
import ForumList from '@/components/ForumList.vue'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'
export default {
  name: 'category-page',
  components: { ForumList },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  methods: {
    ...mapActions(['fetchCategory', 'fetchForums'])
  },
  computed: {
    category () {
      return findById(this.$store.state.categories, this.id) || {}
    },
    forums () {
      return this.$store.state.forums.filter(f => f.categoryId === this.id)
    }
  },
  async created () {
    const category = await this.fetchCategory({ id: this.id })
    await this.fetchForums({ ids: category.forums })
  }
}
</script>

<style scoped lang="css">
.category {
}
</style>
