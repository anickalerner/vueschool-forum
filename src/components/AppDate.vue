<template>
    <span :title="humanFriendlyDate(timestamp)">
        {{ timeFrom(timestamp) }}
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
      type: Number
    }
  },
  mounted () {

  },
  methods: {
    timeFrom (timestamp) {
      return dayjs.unix(timestamp).fromNow()
    },
    humanFriendlyDate (timestamp) {
      return dayjs.unix(timestamp).format('llll')
    }

  }
}

</script>
