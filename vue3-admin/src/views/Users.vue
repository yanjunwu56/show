<script setup>
import { onMounted, ref } from 'vue'
import { fetchUsers } from '../api/mock'

const users = ref([])
const loading = ref(true)

onMounted(async () => {
  users.value = await fetchUsers()
  loading.value = false
})
</script>

<template>
  <section class="users">
    <p class="page-description">
      User data is loaded from a mock API layer to simulate server requests.
    </p>
    <div class="card filter-card">
      <div>
        <div class="card-title">User directory</div>
        <div class="card-subtitle">Search and manage access quickly</div>
      </div>
      <div class="filter-actions">
        <input class="input" type="text" placeholder="Search users" />
        <button class="ghost-button">Invite user</button>
      </div>
    </div>

    <div class="card table-card">
      <div class="table">
        <div class="table-head">
          <span>Name</span>
          <span>Role</span>
          <span>Status</span>
          <span>Last seen</span>
        </div>
        <div v-if="loading" class="table-row">
          <span>Loading...</span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div v-for="user in users" :key="user.name" class="table-row">
          <span class="strong">{{ user.name }}</span>
          <span>{{ user.role }}</span>
          <span class="tag" :class="`tag-${user.status.toLowerCase()}`">
            {{ user.status }}
          </span>
          <span>{{ user.lastSeen }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
