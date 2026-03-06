import { useMemo, useState } from 'react'

// Pagination helper for an array of items.
const usePagination = (items, pageSize = 5) => {
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(pageSize)

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / size)),
    [items.length, size],
  )

  const pagedItems = useMemo(() => {
    const start = (page - 1) * size
    return items.slice(start, start + size)
  }, [items, page, size])

  const next = () => setPage((prev) => Math.min(totalPages, prev + 1))
  const prev = () => setPage((prev) => Math.max(1, prev - 1))

  return { page, size, setSize, totalPages, pagedItems, next, prev, setPage }
}

export { usePagination }
