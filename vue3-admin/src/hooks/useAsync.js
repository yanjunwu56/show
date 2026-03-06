import { ref } from 'vue'

// Wrap an async function with loading and error handling.
const useAsync = (asyncFn) => {
  const data = ref(null)
  const loading = ref(false)
  const error = ref('')

  const run = async (...args) => {
    loading.value = true
    error.value = ''
    try {
      data.value = await asyncFn(...args)
      return data.value
    } catch (err) {
      error.value = err?.message || 'Request failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, run }
}

export { useAsync }
