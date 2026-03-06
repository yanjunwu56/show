import { computed, ref, watch } from 'vue'

// Pagination helper for an array of items.
const usePagination = (itemsRef, pageSize = 5) => {
  const page = ref(1)
  const size = ref(pageSize)

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(itemsRef.value.length / size.value))
  )

  const pagedItems = computed(() => {
    const start = (page.value - 1) * size.value
    return itemsRef.value.slice(start, start + size.value)
  })

  const next = () => {
    page.value = Math.min(totalPages.value, page.value + 1)
  }

  const prev = () => {
    page.value = Math.max(1, page.value - 1)
  }

  watch([itemsRef, size], () => {
    page.value = 1
  })

  return { page, size, totalPages, pagedItems, next, prev }
}

export { usePagination }
