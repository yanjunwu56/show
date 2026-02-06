<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDemoAccounts, login } from '../services/auth'

const route = useRoute()
const router = useRouter()
const form = ref({ username: '', password: '' })
const error = ref('')
const loading = ref(false)
const demoAccounts = getDemoAccounts()

const submit = async () => {
  error.value = ''
  loading.value = true
  try {
    await login(form.value.username, form.value.password)
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } catch (err) {
    error.value = 'Invalid credentials. Try a demo account below.'
  } finally {
    loading.value = false
  }
}

const fillDemo = (account) => {
  form.value.username = account.username
  form.value.password = account.password
}
</script>

<template>
  <section class="login">
    <div class="card login-card">
      <div class="card-title">Sign in</div>
      <p class="page-description">
        This login page enables permission control. Use a demo account to see
        role-based access in action.
      </p>
      <form class="login-form" @submit.prevent="submit">
        <label class="field">
          <span class="field-label">Username</span>
          <input v-model="form.username" class="input" type="text" />
        </label>
        <label class="field">
          <span class="field-label">Password</span>
          <input v-model="form.password" class="input" type="password" />
        </label>
        <button class="ghost-button" type="submit" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>

      <div class="demo">
        <div class="demo-title">Demo accounts</div>
        <div class="demo-actions">
          <button
            v-for="account in demoAccounts"
            :key="account.username"
            class="secondary-button"
            type="button"
            @click="fillDemo(account)"
          >
            {{ account.username }} ({{ account.role }})
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
