<template>
  <the-navbar />
  <div class="container">
    <router-view v-show="showPage" @ready="onPageReady" />
    <app-spinner v-show="!showPage" />
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar.vue'
import { mapActions } from 'vuex'
import AppSpinner from '@/components/AppSpinner.vue'
import NProgress from 'nprogress'
export default {
  name: 'App',
  components: { TheNavbar, AppSpinner },
  data () {
    return {
      showPage: false
    }
  },
  methods: {
    ...mapActions(['fetchAuthUser']),
    onPageReady () {
      this.showPage = true
      NProgress.done()
    }
  },
  async created () {
    this.fetchAuthUser()
    NProgress.configure({
      speed: 200,
      showSpinner: false
    })
    this.$router.beforeEach((to, from) => {
      NProgress.start()
      this.showPage = false
    })
  }
}
</script>

<style>
@import 'assets/style_full.css';
@import '~nprogress/nprogress.css';
#nprogress .bar {
  background: #57ad8d;
}
</style>
