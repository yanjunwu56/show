import { onBeforeUnmount, onMounted } from 'vue'

// Attach and clean up a DOM event listener.
const useEventListener = (target, event, handler) => {
  const getTarget = () =>
    target && 'value' in target ? target.value : target

  onMounted(() => {
    const element = getTarget() || window
    element.addEventListener(event, handler)
  })

  onBeforeUnmount(() => {
    const element = getTarget() || window
    element.removeEventListener(event, handler)
  })
}

export { useEventListener }
