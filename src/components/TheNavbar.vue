<template lang="html">
  <header class="header" id="header" v-page-scroll="()=>navbarOpen = false" v-click-outside="() => navbarOpen = false">
    <router-link :to="{ name: 'Home' }" class="logo">
      <img src="../assets/img/svg/vueschool-logo.svg" />
    </router-link>

    <div class="btn-hamburger" @click="navbarOpen = !navbarOpen">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar" :class="{'navbar-open': navbarOpen}">
      <ul>
        <li v-if="authUser" class="navbar-user">
          <a @click.prevent="userDropdownOpen = !userDropdownOpen" v-click-outside="()=> userDropdownOpen = false">
            <img
              v-if="!!authUser.avatar"
              class="avatar-small"
              :src="authUser.avatar"
              :alt="`{{ authUser.name}} profile picture`"
            />
            <span>
              {{ authUser.name }}
              <img
                class="icon-profile"
                src="../assets/img/svg/arrow-profile.svg"
                alt=""
              />
            </span>
          </a>

          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div id="user-dropdown" :class="{ 'active-drop': userDropdownOpen }">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <router-link :to="{ name: 'Profile' }" class="dropdown-menu-item">
                View profile
              </router-link>
              <li class="dropdown-menu-item">
                <a @click.prevent="signOut">Sign out</a>
              </li>
            </ul>
          </div>
        </li>
        <li v-if="!authUser" class="navbar-item">
          <router-link :to="{ name: 'SignIn' }">Sign in</router-link>
        </li>
        <li v-if="!authUser" class="navbar-item">
          <router-link :to="{ name: 'Register' }">Register</router-link>
        </li>
        <li v-if="authUser" class="navbar-item mobile-only">
          <router-link :to="{ name: 'Profile' }" class="dropdown-menu-item">
            My profile
          </router-link>
        </li>
        <li v-if="authUser" class="navbar-item mobile-only">
          <a @click.prevent="signOut">Sign out</a>
        </li>
      </ul>

      <!-- <ul>
        <li class="navbar-item">
          <a href="index.html">Home</a>
        </li>
        <li class="navbar-item">
          <a href="category.html">Category</a>
        </li>
        <li class="navbar-item">
          <a href="forum.html">Forum</a>
        </li>
        <li class="navbar-item">
          <a href="thread.html">Thread</a>
        </li>
        <!- Show these option only on mobile->
        <li class="navbar-item mobile-only">
          <a href="profile.html">My Profile</a>
        </li>
        <li class="navbar-item mobile-only">
          <a href="#">Logout</a>
        </li>
      </ul> -->
    </nav>
  </header>
</template>

<script lang="js">
import { mapGetters } from 'vuex'
export default {
  name: 'the-navbar',
  data () {
    return {
      userDropdownOpen: false,
      navbarOpen: false
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.$router.beforeEach(() => {
      this.navbarOpen = false
    })
  },
  methods: {
    signOut () {
      this.$store.dispatch('auth/signOut')
      this.$router.push({ name: 'Home' })
    }
  }
}
</script>
