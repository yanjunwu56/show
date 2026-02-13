<script setup>
import { computed, ref } from 'vue'
import { getUser } from '../services/auth'

const form = ref({
  company: 'Northwind',
  timezone: 'UTC+8',
  notify: 'email',
  maintenance: false
})

const user = computed(() => getUser())
</script>

<template>
  <section class="settings">
    <div class="card">
      <div class="card-title">Workspace settings</div>
      <div class="card-subtitle">
        Update preferences that apply to all teams.
      </div>
      <p class="page-description">
        This page is protected by role-based access (admin only). Theme and
        language can be switched from the top bar.
      </p>
      <div class="role-pill">Current role: {{ user?.role || 'unknown' }}</div>

      <div class="form-grid">
        <label class="field">
          <span class="field-label">Company name</span>
          <input v-model="form.company" class="input" type="text" />
        </label>

        <label class="field">
          <span class="field-label">Timezone</span>
          <select v-model="form.timezone" class="input">
            <option value="UTC+0">UTC+0</option>
            <option value="UTC+5">UTC+5</option>
            <option value="UTC+8">UTC+8</option>
            <option value="UTC-5">UTC-5</option>
          </select>
        </label>

        <label class="field">
          <span class="field-label">Notifications</span>
          <select v-model="form.notify" class="input">
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="none">Do not disturb</option>
          </select>
        </label>

        <label class="field toggle-field">
          <span class="field-label">Maintenance window</span>
          <input v-model="form.maintenance" type="checkbox" />
        </label>
      </div>

      <div class="form-actions">
        <button class="ghost-button">Save changes</button>
        <button class="secondary-button">Reset</button>
      </div>
    </div>
  </section>
</template>
