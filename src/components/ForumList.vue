<template lang="html">
  <h2 class="list-title">
    <router-link
      v-if="categoryId"
      :to="{ name: 'Category', params: { id: categoryId } }"
    >
      {{ title }}</router-link
    >
    <span v-else>{{ title }}</span>
  </h2>
  <div class="forum-list">
    <div class="forum-listing" v-for="forum in forums" :key="forum.id">
      <div class="forum-details">
        <router-link
          :to="{ name: 'Forum', params: { id: forum.id } }"
          class="text-xlarge"
          >{{ forum.name }}</router-link
        >
        <p>{{ forum.description }}</p>
      </div>

      <div class="threads-count">
        <p>
          <span class="count">{{ forum.threads?.length }}</span>
          {{ getThreadsWord(forum) }}
        </p>
      </div>

      <div class="last-thread">
        <img
          class="avatar"
          src="https://pbs.twimg.com/profile_images/719242842598699008/Nu43rQz1_400x400.jpg"
          alt=""
        />
        <div class="last-thread-details">
          <a href="thread.html">Post Reactions</a>
          <p class="text-xsmall">
            By <a href="profile.html">Rolf Haug</a>, a month ago
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">

export default {
  name: 'forum-list',
  props: {
    forums: {
      required: true,
      type: Array
    },
    title: {
      required: true,
      type: String
    },
    categoryId: {
      required: false,
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
    getThreadsPerForum (forum) {
      return forum.threads ? forum.threads.length : 0
    },
    getThreadCount (forum) {
      const threads = this.getThreadsPerForum(forum)
      return threads || 'No'
    },
    getThreadCountText (forum) {
      return this.getThreadsPerForum(forum) === 1 ? 'thread' : 'threads'
    },
    getThreadsWord (forum) {
      let word = 'thread'
      if (forum.threads?.length) {
        word += forum.threads.length > 1 ? 's' : ''
      } else {
        word = 'no ' + word + 's'
      }
      return word
    }
  },
  computed: {

  }
}
</script>

<style scoped lang="css">
.forum-list {
}
</style>
