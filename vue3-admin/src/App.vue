<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUser, logout } from './services/auth'

const router = useRouter()
const route = useRoute()
const menuItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/users', label: 'Users' },
  { to: '/settings', label: 'Settings' }
]

const currentTitle = computed(() => route.meta?.title ?? 'Dashboard')
const isAuthLayout = computed(() => route.meta?.layout === 'auth')
const currentUser = computed(() => {
  route.fullPath
  return getUser()
})

const handleLogout = () => {
  logout()
  router.push('/login')
}
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
        <RouterLink
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
      <div class="sidebar-footer">
        <span class="status-dot"></span>
        <span>System healthy</span>
      </div>
    </aside>
    <div class="main">
      <header class="topbar">
        <div>
          <div class="page-title">{{ currentTitle }}</div>
          <div class="page-subtitle">
            12 items are waiting for your review today
          </div>
        </div>
        <div class="topbar-actions">
          <button class="ghost-button">New report</button>
          <div v-if="currentUser" class="user-pill">
            {{ currentUser.name }} · {{ currentUser.role }}
          </div>
          <button class="secondary-button" @click="handleLogout">
            Log out
          </button>
        </div>
      </header>
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>
