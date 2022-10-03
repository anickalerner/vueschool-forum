import { createRouter, createWebHistory } from 'vue-router'
import { findById } from '@/helpers'
import Home from '@/pages/Home'
import ThreadShow from '@/pages/ThreadShow'
import ThreadCreate from '@/pages/ThreadCreate'
import ThreadEdit from '@/pages/ThreadEdit'
import Category from '@/pages/Category'
import Forum from '@/pages/Forum'
import Profile from '@/pages/Profile'
import NotFound from '@/pages/NotFound'
import sourceData from '@/data.json'
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
      checkItemPath(to, next, sourceData.categories)
    }
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    component: Forum,
    props: true,
    beforeEnter (to, from, next) {
      checkItemPath(to, next, sourceData.forums)
    }
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: ThreadShow,
    props: true
    // ,
    // beforeEnter (to, from, next) {
    //   checkItemPath(to, next, sourceData.threads)
    // }
  },
  {
    path: '/forum/:forumId/thread/create',
    name: 'ThreadCreate',
    component: ThreadCreate,
    props: true
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: ThreadEdit,
    props: true
  },
  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: Profile,
    props: { edit: true }
  },
  {
    path: '/me',
    name: 'Profile',
    component: Profile,
    meta: { toTop: true, smooth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

function checkItemPath (to, next, collection) {
  const itemExists = findById(collection, to.params.id)
  if (itemExists) {
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
    // return scroll
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const scroll = {}
        if (to.meta.toTop) scroll.top = 0
        if (to.meta.smooth) scroll.behavior = 'smooth'
        resolve(scroll)
      }, 500)
    })
  }
})
router.beforeEach(() => {
  store.dispatch('unsubscribeAllSnapshots')
})
export default router
