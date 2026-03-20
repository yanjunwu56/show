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

const step = (id) => {
  const task = tasks.get(id)
  if (!task) return
  if (task.canceled) {
    self.postMessage({ type: 'canceled', payload: { id } })
    tasks.delete(id)
    return
  }
  if (task.paused) return

  const { current, end, chunkSize } = task
  const chunkEnd = Math.min(end, current + chunkSize - 1)
  let { sum, count, processed } = task
  for (let i = current; i <= chunkEnd; i += 1) {
    if (isPrime(i)) {
      sum += i
      count += 1
    }
  }
  processed += chunkEnd - current + 1
  tasks.set(id, {
    ...task,
    current: chunkEnd + 1,
    sum,
    count,
    processed,
  })
  self.postMessage({
    type: 'progress',
    payload: {
      id,
      processed,
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

  setTimeout(() => step(id), 0)
}

self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {}
  if (type === 'cancel') {
    const id = payload?.id
    if (tasks.has(id)) {
      const task = tasks.get(id)
      tasks.set(id, { ...task, canceled: true })
      if (task.paused) {
        self.postMessage({ type: 'canceled', payload: { id } })
        tasks.delete(id)
      }
    }
    return
  }

  if (type === 'pause') {
    const id = payload?.id
    const task = tasks.get(id)
    if (task && !task.paused) {
      tasks.set(id, { ...task, paused: true })
      self.postMessage({ type: 'paused', payload: { id } })
    }
    return
  }

  if (type === 'resume') {
    const id = payload?.id
    const task = tasks.get(id)
    if (task && task.paused) {
      tasks.set(id, { ...task, paused: false })
      self.postMessage({ type: 'resumed', payload: { id } })
      step(id)
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
    paused: false,
    total,
    startedAt: performance.now(),
    current: start,
    end,
    chunkSize,
    sum: 0,
    count: 0,
    processed: 0,
  })

  step(id)
})
