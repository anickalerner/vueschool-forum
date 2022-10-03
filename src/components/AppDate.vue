<template>
  <span :title="humanFriendlyDate">
    {{ timeFrom }}
  </span>
</template>

<script lang="js">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedDate from 'dayjs/plugin/localizedFormat'
dayjs.extend(relativeTime)
dayjs.extend(localizedDate)

export default {
  name: 'page-thread-show',
  props: {
    timestamp: {
      required: true,
      type: [Number, Object]
    }
  },
  computed: {
    normalizedTimestamp () {
      return this.timestamp?.seconds || this.timestamp
    },
    timeFrom () {
      return dayjs.unix(this.normalizedTimestamp).fromNow()
    },
    humanFriendlyDate () {
      return dayjs.unix(this.normalizedTimestamp).format('llll')
    }

  }
}
</script>
