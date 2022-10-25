<template lang="html">
  <div class="col-full">
    <div class="item-list">
      <h2 class="list-title">Forums</h2>

      <div v-for="item in items" :key="item.id" class="item">
        <div>
          <p>
            <router-link :to="{ name: 'itemShow', params: { id: item.id } }">
              {{ item.title }}
            </router-link>
          </p>
          <p class="text-faded text-xsmall">
            By <a href="#">{{ userById(item.userId).name }}</a
            >, <app-date :timestamp="item.publishedAt" />.
          </p>
        </div>

        <div class="activity">
          <p class="replies-count">{{ item.posts.length }} replies</p>
          <last-post-info :post="lastPost(item.id)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import LastPostInfo from '@/components/LastPostInfo.vue'
import { findById } from '@/helpers'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export default {
  name: 'item-list',
  props: {
    items: {
      required: true,
      type: Array
    }
  },
  components: { LastPostInfo },
  methods: {
    userById (userId) {
      return findById(this.users, userId)
    },
    lastPost (threadId) {
      return this.posts.filter(p => p.threadId === threadId).sort((a, b) => b.publishedAt - a.publishedAt)[0]
    },
    timeFrom (timestamp) {
      return dayjs.unix(timestamp).fromNow()
    }

  },
  computed: {
    users () {
      return this.$store.state.users.items
    },
    posts () {
      return this.$store.state.posts.items
    }
  }
}
</script>

<style scoped lang="css"></style>
