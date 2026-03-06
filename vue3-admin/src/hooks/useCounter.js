import { computed, ref } from 'vue'

// Simple counter with derived state and actions.
const useCounter = (initial = 0) => {
  const count = ref(initial)
  const double = computed(() => count.value * 2)

  const increment = (step = 1) => {
    count.value += step
  }

  const decrement = (step = 1) => {
    count.value -= step
  }

  const reset = () => {
    count.value = initial
  }

  return { count, double, increment, decrement, reset }
}

export { useCounter }
