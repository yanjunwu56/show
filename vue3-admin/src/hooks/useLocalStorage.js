import { ref, watch } from 'vue'

// Keep a ref value in sync with localStorage.
const useLocalStorage = (key, initialValue) => {
  const raw = localStorage.getItem(key)
  const stored = raw ? JSON.parse(raw) : initialValue
  const state = ref(stored)

  watch(
    state,
    (value) => {
      localStorage.setItem(key, JSON.stringify(value))
    },
    { deep: true }
  )

  return state
}

export { useLocalStorage }
