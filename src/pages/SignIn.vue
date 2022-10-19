<template lang="html">
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form action="" class="card card-form" @submit.prevent="signin">
        <h1 class="text-center">Login</h1>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            v-model="form.email"
            id="email"
            type="text"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="form.password"
            id="password"
            type="password"
            class="form-input"
          />
        </div>

        <div class="push-top">
          <button type="submit" class="btn-blue btn-block">Log in</button>
        </div>

        <div class="form-actions text-right">
          <router-link :to="{ name: 'Register' }"
            >Create an account</router-link
          >
        </div>
      </form>

      <div class="push-top text-center">
        <button class="btn-red btn-xsmall" @click.prevent="signInWithGoogle">
          <i class="fa fa-google fa-btn"></i>Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import successRedirect from '@/mixins/successRedirect'
export default {
  name: 'sign-in',
  props: [],
  mounted () {

  },
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  mixins: [successRedirect],
  methods: {
    async signin () {
      try {
        await this.$store.dispatch('signInWithEmailAndPassword', { ...this.form })
        this.successRedirect()
      } catch (error) {
        alert(error)
      }
    },
    async signInWithGoogle () {
      await this.$store.dispatch('signInWithGoogle', { ...this.form })
      this.successRedirect()
    }
  },
  created () {
    this.$emit('ready')
  }
}
</script>

<style scoped lang="css">
.sign-in {
}
</style>
