<template lang="html">
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form action="" class="card card-form" @submit.prevent="register">
        <h1 class="text-center">Register</h1>

        <div class="form-group">
          <label for="name">Full Name</label>
          <input v-model="form.name" id="name" type="text" class="form-input" />
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input
            v-model="form.username"
            id="username"
            type="text"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            v-model="form.email"
            id="email"
            type="email"
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

        <div class="form-group">
          <label for="avatar"
            >Avatar
            <div v-if="avatarPreview">
              <img :src="avatarPreview" class="avatar-large" />
              <button @click.prevent="avatarPreview = null">
                Change image
              </button>
            </div>
          </label>
          <input
            v-show="!avatarPreview"
            id="avatar"
            type="file"
            @change="handleAvatarInput"
            class="form-input"
            accept="image/*"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>

        <div class="form-actions text-right">
          Have an account?&nbsp;
          <router-link :to="{ name: 'SignIn' }"> Sign in</router-link>
        </div>
      </form>
      <div class="text-center push-top">
        <button class="btn-red btn-xsmall" @click.prevent="signUpWithGoogle">
          <i class="fa fa-google fa-btn"></i>Sign up with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import successRedirect from '@/mixins/successRedirect'

export default {
  name: 'page-register',
  props: [],
  mixins: [successRedirect],
  data () {
    return {
      avatarPreview: null,
      form: {
        name: '',
        username: '',
        password: '',
        email: '',
        avatar: null
      }

    }
  },
  methods: {
    async register () {
      await this.$store.dispatch('auth/registerUserWithEmailAndPassword', this.form)
      this.successRedirect()
    },
    async signUpWithGoogle () {
      await this.$store.dispatch('auth/signUpWithGoogle')
      this.successRedirect()
    },
    handleAvatarInput (e) {
      this.form.avatar = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        this.avatarPreview = event.target.result
      }
      reader.readAsDataURL(this.form.avatar)
    }
  },
  created () {
    this.$emit('ready')
  }
}
</script>

<style scoped lang="css">
.register {
}
</style>
