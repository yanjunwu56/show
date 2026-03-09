import { ref } from 'vue'

// Throttle a function to avoid excessive calls.
const useThrottle = (fn, delay = 200) => {
  const lastCalled = ref(0)

  return (...args) => {
    const now = Date.now()
    if (now - lastCalled.value < delay) return
    lastCalled.value = now
    fn(...args)
  }
}

export { useThrottle }
