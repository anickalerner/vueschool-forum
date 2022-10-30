<template lang="html">
  <div class="activity">
    <div class="activity-header">
      <img
        v-if="threadAuthor?.avatar"
        :src="threadAuthor.avatar"
        alt=""
        class="hide-mobile avatar-small"
      />
      <p class="title" v-if="postsThread && threadAuthor">
        {{ postsThread.title }}
        <span>{{ subTitleText }}</span>
      </p>
    </div>

    <div class="post-content">
      <div>
        <p>
          {{ post.text }}
        </p>
      </div>
    </div>

    <div class="thread-details">
      <app-date :timestamp="post.publishedAt" />
    </div>
  </div>
</template>

<script lang="js">
import { mapGetters, mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  name: 'user-profile-post-item',
  props: {
    post: {
      type: Object,
      required: true
    },
    user: {
      type: Object
    }
  },
  mixins: [asyncDataStatus],
  data () {
    return {
      postsThread: null,
      threadAuthor: null,
      isStartingPost: false,
      forumName: ''
    }
  },
  methods: {
    ...mapActions({ fetchPosts: 'posts/fetchPosts', fetchThread: 'threads/fetchThread' })
  },
  computed: {
    ...mapGetters({ threadById: 'threads/threadById' }),
    subTitleText () {
      if (this.isStartingPost) {
        return this.user.name + ' started a topic in ' + this.forumName
      } else {
        return this.user.name + ' replied to ' + this.threadAuthor.name + '\'s topic in ' + this.forumName
      }
    }
  },
  async created () {
    this.postsThread = await this.fetchThread({ id: this.post.threadId })
    const firstPostId = this.postsThread.firstPostId || this.postsThread.posts[0]
    this.isStartingPost = firstPostId === this.post.id
    if (!this.postsThread.userId !== this.user.id) {
      this.threadAuthor = await this.$store.dispatch('users/fetchUser', { id: this.postsThread.userId })
    } else {
      this.threadAuthor = this.user
    }
    const forum = await this.$store.dispatch('forums/fetchForum', { id: this.postsThread.forumId })
    this.forumName = forum?.name
    this.asyncDataStatus_fetched()
  }
}
</script>

<style scoped lang="css">
.post-content {
  display: flex;
  flex: 1 0 83%;
  padding-left: 15px;
  padding-right: 10px;
  font-size: 16px;
  text-align: justify;
  line-height: 1.5;
  word-break: break-word;
}

.post-content h1,
.post-content h2,
.post-content h3 {
  margin-bottom: 0;
}

.post-content p {
  margin-bottom: 20px;
}

.post-content pre {
  display: grid;
  overflow: auto;
  word-wrap: break-word;
  border-radius: 3px;
  padding: 10px;
}

.post-content blockquote {
  margin: 25px 0px;
}

.post-content blockquote.big {
  display: flex;
  position: relative;
}

.post-content blockquote.big::before {
  position: absolute;
  top: -25px;
  left: -25px;
  font-size: 42px;
  font-family: FontAwesome;
  content: '\f10e';
  color: #263959;
}

@media (max-width: 820px) {
  .post-content blockquote.big::before {
    top: -15px;
    left: -18px;
    font-size: 32px;
  }
}

.post-content blockquote.big .quote {
  padding-left: 20px;
  padding-right: 15px;
  flex-basis: 95%;
  font-weight: 100;
  font-style: italic;
  font-size: 17px;
}

.post-content blockquote.big .author {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
}

.post-content blockquote.big .author img {
  flex: 1;
  flex-basis: 100%;
  margin-top: 10px;
  width: 80px;
  height: 80px;
}

.post-content blockquote.small {
  position: relative;
  flex-direction: column;
  border: 2px solid rgba(152, 152, 152, 0.15);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.post-content blockquote.small::before {
  position: absolute;
  top: -20px;
  left: -20px;
  font-size: 42px;
  font-family: FontAwesome;
  content: '\f10e';
  color: #263959;
}

@media (max-width: 820px) {
  .post-content blockquote.small::before {
    top: -18px;
    left: -15px;
    font-size: 32px;
  }
}

.post-content blockquote.small .author {
  display: flex;
  flex-basis: 100%;
  padding: 3px 10px 3px 28px;
  background-color: rgba(152, 152, 152, 0.15);
  justify-content: center;
  align-items: center;
}

.post-content blockquote.small .author .time {
  margin-left: 10px;
}

.post-content blockquote.small .author .fa {
  margin-left: auto;
  font-size: 20px;
}

.post-content blockquote.small .author .fa:hover {
  cursor: pointer;
}

.post-content blockquote.small .quote {
  display: flex;
  flex-basis: 100%;
  flex-direction: column;
  padding: 10px;
  font-weight: 100;
  font-style: italic;
  font-size: 17px;
}

.post-content blockquote.simple {
  position: relative;
  padding: 0px 10px 0px 20px;
  font-weight: 100;
  font-style: italic;
  font-size: 17px;
  letter-spacing: 0.15px;
}

.post-content blockquote.simple::before {
  position: absolute;
  top: -25px;
  left: -25px;
  font-size: 42px;
  font-family: FontAwesome;
  content: '\f10e';
  color: #263959;
}

@media (max-width: 820px) {
  .post-content blockquote.simple::before {
    top: -15px;
    left: -18px;
    font-size: 32px;
  }
}

.post-content blockquote.simple .author {
  display: block;
  margin-top: 10px;
  font-weight: normal;
}

.post-content blockquote.simple .author .time {
  margin-left: 10px;
}

.post-listing-editor {
  flex: 1 1 83%;
}
</style>
