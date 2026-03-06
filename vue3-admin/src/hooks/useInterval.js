import { onBeforeUnmount, ref } from 'vue'

// Interval timer that can be started and stopped.
const useInterval = (callback, delay = 1000) => {
  const timer = ref(null)

  const start = () => {
    if (timer.value) return
    timer.value = setInterval(callback, delay)
  }

  const stop = () => {
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
  }

  onBeforeUnmount(() => {
    stop()
  })

  return { start, stop, running: timer }
}

export { useInterval }
