<script setup>
const users = [
  { name: 'Ava Wilson', role: 'Admin', status: 'Active', lastSeen: '2 hours ago' },
  { name: 'Noah Carter', role: 'Manager', status: 'Active', lastSeen: 'Today' },
  { name: 'Mia Green', role: 'Support', status: 'Invited', lastSeen: 'Yesterday' },
  { name: 'Liam Hart', role: 'Analyst', status: 'Suspended', lastSeen: '3 days ago' },
  { name: 'Emma Stone', role: 'Finance', status: 'Active', lastSeen: '5 minutes ago' }
]
</script>

<template>
  <section class="users">
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
