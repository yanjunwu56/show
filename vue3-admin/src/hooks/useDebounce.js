import { ref, watch } from 'vue'

// Debounce a reactive value by a fixed delay.
const useDebounce = (sourceRef, delay = 300) => {
  const debounced = ref(sourceRef.value)
  let timer = null

  watch(
    sourceRef,
    (value) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        debounced.value = value
      }, delay)
    },
    { immediate: true }
  )

  return debounced
}

export { useDebounce }
