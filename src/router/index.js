import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home'
import ThreadShow from '@/pages/ThreadShow'
import ThreadCreate from '@/pages/ThreadCreate'
import ThreadEdit from '@/pages/ThreadEdit'
import Category from '@/pages/Category'
import Forum from '@/pages/Forum'
import Profile from '@/pages/Profile'
import Register from '@/pages/Register'
import SignIn from '@/pages/SignIn'
import NotFound from '@/pages/NotFound'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: Category,
    props: true,
    beforeEnter (to, from, next) {
      checkItemPath(to, next, 'categories/fetchCategories')
    }
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    component: Forum,
    props: true,
    beforeEnter (to, from, next) {
      checkItemPath(to, next, 'forums/fetchForum')
    }
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: ThreadShow,
    props: true,
    beforeEnter (to, from, next) {
      checkItemPath(to, next, 'threads/fetchThread')
    }
  },
  {
    path: '/forum/:forumId/thread/create',
    name: 'ThreadCreate',
    component: ThreadCreate,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: ThreadEdit,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/me',
    name: 'Profile',
    component: Profile,
    meta: { toTop: true, smooth: true, requiresAuth: true }
  },
  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: Profile,
    props: { edit: true },
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn,
    meta: { requiresGuest: true }
  },
  {
    path: '/signout',
    name: 'SignOut',
    async beforeEnter () {
      await store.dispatch('auth/signOut')
      return { name: 'Home' }
    }
  }
]

async function checkItemPath (to, next, action) {
  const actionParam = to.params?.id ? { id: to.params.id, once: true } : {}
  const result = await store.dispatch(action, actionParam)
  if (result) {
    return next()
  } else {
    next({
      name: 'NotFound',
      params: { pathMatch: to.path.split('/').slice(1) },
      query: to.query,
      hash: to.hash
    })
  }
}
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const scroll = {}
        if (to.meta.toTop) scroll.top = 0
        if (to.meta.smooth) scroll.behavior = 'smooth'
        resolve(scroll)
      }, 500)
    })
  }
})
router.beforeEach(async (to, from) => {
  await store.dispatch('auth/initAuthentication')
  console.log(`🚦 navigating to ${to.name} from ${from.name}`)
  store.dispatch('unsubscribeAllSnapshots')
  if (to.meta.requiresAuth && !store.state.auth.authId) {
    return { name: 'SignIn', query: { redirectTo: to.path } }
  }
  if (
    ['SignIn', 'Register'].includes(to.name) &&
    typeof from.query?.redirectTo !== 'undefined' &&
    typeof to.query?.redirectTo === 'undefined'
  ) {
    debugger
    return { ...to, query: { redirectTo: from.query.redirectTo } }
  }
  if (to.meta.requiresGuest && store.state.auth.authId) {
    return { name: 'Home' }
  }
})
export default router
