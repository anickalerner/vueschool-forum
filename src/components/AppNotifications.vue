<template lang="html">
  <div class="notifications">
    <TransitionGroup name="notification">
      <div
        class="notification"
        v-for="notification in notifications"
        :key="notification.id"
      >
        {{ notification.message }}
        <button @click.prevent="removeNotification(notification.id)">x</button>
      </div>
    </TransitionGroup>
  </div>
</template>
<script lang="js">
import useNotifications from '@/composables/useNotifications'
export default {
  setup () {
    const { notifications, removeNotification } = useNotifications()
    return { notifications, removeNotification }
  }
}
</script>

<style scoped lang="css">
.notifications {
  position: fixed;
  bottom: 20px;
  right: 0;
}
.notification {
  background: white;
  display: flex;
  justify-content: space-between;
  width: 350px;
  box-shadow: 2px 2px 2px 2px rbga(0, 0, 0.5);
  padding: 10px 20px;
  margin-bottom: 5px;
  border-left: 5px solid #263959;
}
.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s ease;
}
.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.notification-move {
  transition: transform 0.8s ease;
}
</style>
