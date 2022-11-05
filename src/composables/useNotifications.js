import { reactive } from 'vue'
import remove from 'lodash/remove'
const notifications = reactive([])

const addNotification = ({ message, timeout = null }) => {
  const id = Math.random() + Date.now()
  notifications.push({
    id,
    message
  })
  if (timeout) {
    setTimeout(() => removeNotification(id), timeout)
  }
}

const removeNotification = (id) => {
  remove(notifications, (n) => n.id === id)
}

const removeEldestNotification = () => {
  notifications.splice(0, 1)
}
export default function useNotification () {
  return {
    notifications,
    addNotification,
    removeNotification,
    removeEldestNotification
  }
}
