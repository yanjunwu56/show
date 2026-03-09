/* eslint-disable no-restricted-globals */
// Heavy computation worker: sum primes with chunked progress.
const tasks = new Map()

const isPrime = (value) => {
  if (value < 2) return false
  if (value === 2) return true
  if (value % 2 === 0) return false
  for (let i = 3; i * i <= value; i += 2) {
    if (value % i === 0) return false
  }
  return true
}

const processChunk = (id, current, end, chunkSize, sum, count, processed) => {
  const task = tasks.get(id)
  if (!task || task.canceled) {
    self.postMessage({ type: 'canceled', payload: { id } })
    tasks.delete(id)
    return
  }

  const chunkEnd = Math.min(end, current + chunkSize - 1)
  for (let i = current; i <= chunkEnd; i += 1) {
    if (isPrime(i)) {
      sum += i
      count += 1
    }
  }
  const nextProcessed = processed + (chunkEnd - current + 1)
  self.postMessage({
    type: 'progress',
    payload: {
      id,
      processed: nextProcessed,
      total: task.total,
      sum,
      count,
    },
  })

  if (chunkEnd >= end) {
    const duration = Math.round(performance.now() - task.startedAt)
    self.postMessage({
      type: 'done',
      payload: { id, sum, count, duration },
    })
    tasks.delete(id)
    return
  }

  setTimeout(() => {
    processChunk(id, chunkEnd + 1, end, chunkSize, sum, count, nextProcessed)
  }, 0)
}

self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {}
  if (type === 'cancel') {
    const id = payload?.id
    if (tasks.has(id)) {
      tasks.set(id, { ...tasks.get(id), canceled: true })
    }
    return
  }

  if (type !== 'start') return
  const id = payload?.id
  if (!id) return
  const start = Number(payload?.start) || 2
  const end = Number(payload?.end) || 0
  const chunkSize = Number(payload?.chunkSize) || 1000
  const total = Math.max(0, end - start + 1)

  tasks.set(id, {
    canceled: false,
    total,
    startedAt: performance.now(),
  })

  processChunk(id, start, end, chunkSize, 0, 0, 0)
})
