<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumbs from './components/Breadcrumbs.vue'
import NotificationPanel from './components/NotificationPanel.vue'
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead
} from './api'
import { pushNotification } from './api/handlers'
import { t, currentLocale, setLocale } from './i18n'
import { getUser, logout } from './services/auth'
import { getShortcuts, toggleShortcut } from './services/shortcuts'
import { getTheme, toggleTheme } from './services/theme'
import { connect, disconnect, onMessage } from './services/socket'

const router = useRouter()
const route = useRoute()
const menuItems = [
  { to: '/dashboard', label: 'Dashboard', key: 'dashboard' },
  { to: '/users', label: 'Users', key: 'users' },
  { to: '/settings', label: 'Settings', key: 'settings' }
]

const currentTitle = computed(() => {
  if (route.meta?.titleKey) return t(route.meta.titleKey)
  return route.meta?.title ?? t('dashboard')
})
const isAuthLayout = computed(() => route.meta?.layout === 'auth')
const currentUser = computed(() => {
  route.fullPath
  return getUser()
})
const shortcuts = ref(getShortcuts())
const notifications = ref([])
const notificationsOpen = ref(false)
const theme = ref(getTheme())

const unreadCount = computed(
  () => notifications.value.filter((note) => !note.read).length
)

const handleLogout = () => {
  logout()
  router.push('/login')
}

const handleToggleTheme = () => {
  theme.value = toggleTheme()
}

const handleToggleShortcut = (item) => {
  shortcuts.value = toggleShortcut(item)
}

const isShortcut = (item) =>
  shortcuts.value.some((shortcut) => shortcut.to === item.to)

const loadNotifications = async () => {
  notifications.value = await fetchNotifications()
}

const handleMarkRead = async (id) => {
  notifications.value = await markNotificationRead(id)
}

const handleMarkAll = async () => {
  notifications.value = await markAllNotificationsRead()
}

const toggleNotifications = () => {
  notificationsOpen.value = !notificationsOpen.value
}

const updateLocale = (event) => {
  setLocale(event.target.value)
}

let socketUnsubscribe = null

const realtimeEnabled = computed(
  () => !isAuthLayout.value && Boolean(currentUser.value)
)

const startRealtime = async () => {
  await loadNotifications()
  connect()
  socketUnsubscribe = onMessage((message) => {
    notifications.value = pushNotification(message)
  })
}

const stopRealtime = () => {
  if (socketUnsubscribe) socketUnsubscribe()
  socketUnsubscribe = null
  disconnect()
}

watch(
  realtimeEnabled,
  (enabled) => {
    if (enabled) {
      startRealtime()
    } else {
      stopRealtime()
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  stopRealtime()
})
</script>

<template>
  <div v-if="isAuthLayout" class="auth-layout">
    <RouterView />
  </div>
  <div v-else class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-badge">VA</div>
        <div>
          <div class="brand-title">Vue3 Admin</div>
          <div class="brand-subtitle">Lightweight control center</div>
        </div>
      </div>
      <nav class="nav">
        <div v-for="item in menuItems" :key="item.to" class="nav-item-row">
          <RouterLink :to="item.to" class="nav-item">
            {{ t(item.key) }}
          </RouterLink>
          <button
            class="pin-button"
            type="button"
            @click.stop="handleToggleShortcut(item)"
          >
            {{ isShortcut(item) ? '★' : '☆' }}
          </button>
        </div>
      </nav>
      <div class="shortcuts">
        <div class="shortcuts-title">{{ t('shortcuts') }}</div>
        <RouterLink
          v-for="item in shortcuts"
          :key="item.to"
          :to="item.to"
          class="shortcut-item"
        >
          {{ t(item.key) }}
        </RouterLink>
        <div v-if="!shortcuts.length" class="shortcuts-empty">
          Pin pages to build shortcuts.
        </div>
      </div>
      <div class="sidebar-footer">
        <span class="status-dot"></span>
        <span>System healthy</span>
      </div>
    </aside>
    <div class="main">
      <header class="topbar">
        <div class="topbar-left">
          <Breadcrumbs />
          <div>
            <div class="page-title">{{ currentTitle }}</div>
            <div class="page-subtitle">
              12 items are waiting for your review today
            </div>
          </div>
        </div>
        <div class="topbar-actions">
          <button class="ghost-button">New report</button>
          <button class="icon-button" type="button" @click="toggleNotifications">
            🔔
            <span v-if="unreadCount" class="badge">{{ unreadCount }}</span>
          </button>
          <label class="select-label">
            {{ t('language') }}
            <select
              class="input small-input"
              :value="currentLocale"
              @change="updateLocale"
            >
              <option value="en">EN</option>
              <option value="de">DE</option>
            </select>
          </label>
          <button class="secondary-button" @click="handleToggleTheme">
            {{ t('theme') }}: {{ theme }}
          </button>
          <div v-if="currentUser" class="user-pill">
            {{ currentUser.name }} · {{ currentUser.role }}
          </div>
          <button class="secondary-button" @click="handleLogout">
            Log out
          </button>
        </div>
      </header>
      <NotificationPanel
        v-if="notificationsOpen"
        :notifications="notifications"
        :unread-count="unreadCount"
        @close="notificationsOpen = false"
        @mark-read="handleMarkRead"
        @mark-all="handleMarkAll"
      />
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>
