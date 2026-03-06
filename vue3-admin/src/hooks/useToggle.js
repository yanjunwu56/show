import { ref } from 'vue'

// Boolean toggle with a helpful setter.
const useToggle = (initial = false) => {
  const value = ref(initial)

  const toggle = () => {
    value.value = !value.value
  }

  const set = (next) => {
    value.value = Boolean(next)
  }

  return { value, toggle, set }
}

export { useToggle }
