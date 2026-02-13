<script setup>
const props = defineProps({
  notifications: {
    type: Array,
    default: () => []
  },
  unreadCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close', 'markRead', 'markAll'])
</script>

<template>
  <div class="notification-panel">
    <div class="notification-header">
      <div>
        <div class="card-title">Notifications</div>
        <div class="card-subtitle">
          Updated through the mock WebSocket feed.
        </div>
      </div>
      <button class="secondary-button" type="button" @click="emit('close')">
        Close
      </button>
    </div>
    <div class="notification-actions">
      <span>{{ unreadCount }} unread</span>
      <button class="ghost-button" type="button" @click="emit('markAll')">
        Mark all read
      </button>
    </div>
    <div class="notification-list">
      <div
        v-for="note in notifications"
        :key="note.id"
        class="notification-item"
        :class="{ unread: !note.read }"
      >
        <div>
          <div class="notification-title">{{ note.title }}</div>
          <div class="notification-body">{{ note.body }}</div>
          <div class="notification-time">{{ note.time }}</div>
        </div>
        <button
          class="secondary-button"
          type="button"
          @click="emit('markRead', note.id)"
        >
          Mark read
        </button>
      </div>
    </div>
  </div>
</template>
