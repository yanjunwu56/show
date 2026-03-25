// v-intersect triggers a callback when the element enters the viewport.
const intersect = {
  mounted(el, binding) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          binding.value?.()
        }
      })
    })
    el._observer = observer
    observer.observe(el)
  },
  unmounted(el) {
    el._observer?.disconnect()
    delete el._observer
  }
}

export { intersect }
