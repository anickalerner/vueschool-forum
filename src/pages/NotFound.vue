<template lang="html">
  <section class="col-full not-found text-center">
    <h1>Page not found</h1>
    <router-link :to="{ name: 'Home' }">Home page</router-link>
  </section>
</template>

<script lang="js">

export default {
  name: 'not-found',
  created () {
    this.$emit('ready')
  }
}
</script>
