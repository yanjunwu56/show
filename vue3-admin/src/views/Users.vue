<script setup>
import { onMounted, ref } from 'vue'
import DataTable from '../components/DataTable.vue'
import { fetchUsers } from '../api'

const users = ref([])
const loading = ref(true)
const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'lastSeen', label: 'Last seen', sortable: true }
]

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
      <p class="page-description">
        The table below supports pagination, sorting, filtering, and column
        toggles.
      </p>
      <div v-if="loading" class="loading">Loading users...</div>
      <DataTable v-else :rows="users" :columns="columns" />
    </div>
  </section>
</template>
