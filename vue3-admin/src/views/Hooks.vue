<script setup>
defineOptions({ name: 'Hooks' })

import { computed, onUnmounted, ref, watch, watchEffect } from 'vue'
import { formatNumber } from '@admin/shared'
import { useAsync } from '../hooks/useAsync'
import { useCounter } from '../hooks/useCounter'
import { useDebounce } from '../hooks/useDebounce'
import { useEventListener } from '../hooks/useEventListener'
import { useInterval } from '../hooks/useInterval'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { usePagination } from '../hooks/usePagination'
import { useThrottle } from '../hooks/useThrottle'
import { useToggle } from '../hooks/useToggle'
import { emitMessage } from '../services/socket'

const message = ref('hello hooks')
const upperMessage = computed(() => message.value.toUpperCase())

const watchLog = ref([])
watch(message, (next, prev) => {
  // Track watch changes.
  watchLog.value = [`${prev} -> ${next}`, ...watchLog.value].slice(0, 5)
})

const effectLog = ref('')
watchEffect(() => {
  // Auto-update effect when message changes.
  effectLog.value = `Effect sees: ${message.value}`
})

const lifecycleLog = ref([])
onMounted(() => {
  lifecycleLog.value.push('Mounted at ' + new Date().toLocaleTimeString())
})
onUnmounted(() => {
  lifecycleLog.value.push('Unmounted at ' + new Date().toLocaleTimeString())
})

const { count, double, increment, decrement, reset } = useCounter(2)
const { value: isOn, toggle: toggleSwitch } = useToggle(false)

const debounceInput = ref('')
const debouncedSearch = useDebounce(debounceInput, 500)
const throttleInput = ref('')
const throttledValue = ref('')
const throttledSearch = useThrottle((value) => {
  // Throttle expensive search updates.
  throttledValue.value = value
}, 300)

const storageNote = useLocalStorage('vue3-admin-note', 'Remember to review.')

const pointer = ref({ x: 0, y: 0 })
useEventListener(window, 'mousemove', (event) => {
  // Store pointer position for demo.
  pointer.value = { x: event.clientX, y: event.clientY }
})

const items = ref(
  Array.from({ length: 24 }, (_, index) => `Item ${index + 1}`)
)
const { page, size, totalPages, pagedItems, next, prev } = usePagination(
  items,
  6
)

const { data, loading, error, run } = useAsync(async () => {
  // Mock async call for demo purposes.
  await new Promise((resolve) => setTimeout(resolve, 800))
  return `Fetched at ${new Date().toLocaleTimeString()}`
})

const intervalTicks = ref(0)
const { start: startInterval, stop: stopInterval, running } = useInterval(() => {
  intervalTicks.value += 1
}, 1000)

// Workspace dependency from packages/shared (monorepo linking).
const sharedNumber = formatNumber(1234567)

const workerLimit = ref(20000)
const workerCount = ref(Math.min(4, navigator.hardwareConcurrency || 4))
const chunkSize = ref(2000)
const workerTasks = ref([])
const workerQueue = ref([])
const activeJob = ref(null)
const workerPool = new Map()
const lastNotifiedPercent = ref(-1)

const overallProgress = computed(() => {
  const totals = workerTasks.value.reduce(
    (acc, task) => {
      acc.total += task.total
      acc.processed += task.processed
      acc.sum += task.sum
      acc.count += task.count
      return acc
    },
    { total: 0, processed: 0, sum: 0, count: 0 }
  )
  const percent = totals.total
    ? Math.round((totals.processed / totals.total) * 100)
    : 0
  return { ...totals, percent }
})

const isRunning = computed(() =>
  workerTasks.value.some(
    (task) => task.status === 'running' || task.status === 'starting'
  )
)

const emitProgressNotification = (percent) => {
  if (!activeJob.value) return
  const payload = {
    id: `job-${activeJob.value.id}-${percent}`,
    title: 'Worker progress',
    body: `Job ${activeJob.value.id}: ${percent}% complete`,
    read: false,
    time: 'Just now'
  }
  emitMessage(payload)
}

const createRanges = (job) => {
  const limit = Math.max(2, job.limit)
  const count = Math.max(1, job.workerCount)
  const size = Math.ceil((limit - 1) / count)
  const ranges = []
  let start = 2
  for (let index = 0; index < count; index += 1) {
    const end = Math.min(limit, start + size - 1)
    if (start > limit) break
    ranges.push({ start, end })
    start = end + 1
  }
  return ranges
}

const updateTask = (id, patch) => {
  const task = workerTasks.value.find((item) => item.id === id)
  if (!task) return
  Object.assign(task, patch)
}

const handleWorkerMessage = (event) => {
  const { type, payload } = event.data || {}
  const id = payload?.id
  if (!id) return
  if (type === 'progress') {
    updateTask(id, {
      processed: payload.processed,
      sum: payload.sum,
      count: payload.count,
      status: 'running'
    })
  }
  if (type === 'paused') {
    updateTask(id, { status: 'paused' })
  }
  if (type === 'resumed') {
    updateTask(id, { status: 'running' })
  }
  if (type === 'done') {
    updateTask(id, {
      processed: workerTasks.value.find((t) => t.id === id)?.total || 0,
      sum: payload.sum,
      count: payload.count,
      duration: payload.duration,
      status: 'done'
    })
    workerPool.get(id)?.terminate()
    workerPool.delete(id)
  }
  if (type === 'canceled') {
    updateTask(id, { status: 'canceled' })
    workerPool.get(id)?.terminate()
    workerPool.delete(id)
  }
}

const startWorkers = (job) => {
  stopWorkers(false)
  const ranges = createRanges(job)
  const tasks = ranges.map((range, index) => ({
    id: `${job.id}-${index}`,
    start: range.start,
    end: range.end,
    total: range.end - range.start + 1,
    processed: 0,
    sum: 0,
    count: 0,
    duration: 0,
    status: 'starting'
  }))
  workerTasks.value = tasks
  tasks.forEach((task) => {
    const worker = new Worker(
      new URL('../workers/computeWorker.js', import.meta.url),
      { type: 'module' }
    )
    workerPool.set(task.id, worker)
    worker.addEventListener('message', handleWorkerMessage)
    worker.postMessage({
      type: 'start',
      payload: {
        id: task.id,
        start: task.start,
        end: task.end,
        chunkSize: job.chunkSize
      }
    })
  })
}

const startNextJob = () => {
  if (isRunning.value || activeJob.value) return
  const nextJob = workerQueue.value.shift()
  if (!nextJob) return
  activeJob.value = { ...nextJob, status: 'running' }
  lastNotifiedPercent.value = -1
  startWorkers(nextJob)
}

const enqueueJob = () => {
  const job = {
    id: `${Date.now()}`.slice(-6),
    limit: workerLimit.value,
    workerCount: workerCount.value,
    chunkSize: chunkSize.value,
    status: 'queued'
  }
  workerQueue.value.push(job)
  if (!activeJob.value && !isRunning.value) {
    startNextJob()
  }
}

const pauseWorkers = () => {
  workerTasks.value.forEach((task) => {
    if (task.status === 'running' || task.status === 'starting') {
      updateTask(task.id, { status: 'pausing' })
      workerPool.get(task.id)?.postMessage({
        type: 'pause',
        payload: { id: task.id }
      })
    }
  })
}

const resumeWorkers = () => {
  workerTasks.value.forEach((task) => {
    if (task.status === 'paused') {
      workerPool.get(task.id)?.postMessage({
        type: 'resume',
        payload: { id: task.id }
      })
    }
  })
}

const cancelWorkers = () => {
  workerTasks.value.forEach((task) => {
    if (task.status === 'running' || task.status === 'starting') {
      updateTask(task.id, { status: 'canceling' })
      workerPool.get(task.id)?.postMessage({
        type: 'cancel',
        payload: { id: task.id }
      })
    }
  })
}

const clearQueue = () => {
  workerQueue.value = []
}

const stopAll = () => {
  stopWorkers(true)
  clearQueue()
}

const stopWorkers = (resetJob = true) => {
  workerPool.forEach((worker) => worker.terminate())
  workerPool.clear()
  workerTasks.value = []
  if (resetJob) {
    activeJob.value = null
  }
}

watch(
  () => overallProgress.value.percent,
  (percent) => {
    if (!activeJob.value) return
    if (percent === 100 || percent - lastNotifiedPercent.value >= 10) {
      lastNotifiedPercent.value = percent
      emitProgressNotification(percent)
    }
  }
)

watch(
  () => workerTasks.value.map((task) => task.status),
  () => {
    if (!workerTasks.value.length || !activeJob.value) return
    const done = workerTasks.value.every((task) =>
      ['done', 'canceled'].includes(task.status)
    )
    if (done) {
      const status = workerTasks.value.some((task) => task.status === 'canceled')
        ? 'canceled'
        : 'done'
      activeJob.value = { ...activeJob.value, status }
      emitMessage({
        id: `job-${activeJob.value.id}-${status}`,
        title: 'Worker job finished',
        body: `Job ${activeJob.value.id} ${status}`,
        read: false,
        time: 'Just now'
      })
      activeJob.value = null
      workerTasks.value = []
      startNextJob()
    }
  }
)
onUnmounted(() => {
  stopWorkers()
})
</script>

<template>
  <section class="hooks">
    <div class="card">
      <div class="card-title">Official Composition API hooks</div>
      <p class="page-description">
        These blocks use ref, computed, watch, watchEffect, and lifecycle hooks.
      </p>
      <div class="hooks-grid">
        <div class="hook-card">
          <div class="hook-title">ref + computed</div>
          <input v-model="message" class="input" type="text" />
          <div class="hook-meta">Upper: {{ upperMessage }}</div>
        </div>
        <div class="hook-card">
          <div class="hook-title">watch</div>
          <div class="hook-meta">Latest changes:</div>
          <ul class="hook-list">
            <li v-for="log in watchLog" :key="log">{{ log }}</li>
          </ul>
        </div>
        <div class="hook-card">
          <div class="hook-title">watchEffect</div>
          <div class="hook-meta">{{ effectLog }}</div>
        </div>
        <div class="hook-card">
          <div class="hook-title">Lifecycle</div>
          <div class="hook-meta">See mount logs below:</div>
          <ul class="hook-list">
            <li v-for="log in lifecycleLog" :key="log">{{ log }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Custom composables</div>
      <p class="page-description">
        Custom hooks start simple and grow to manage async work and pagination.
      </p>
      <div class="hooks-grid">
        <div class="hook-card">
          <div class="hook-title">useCounter</div>
          <div class="hook-meta">Count: {{ count }} (double: {{ double }})</div>
          <div class="hook-actions">
            <button class="secondary-button" @click="decrement()">-</button>
            <button class="secondary-button" @click="increment()">+</button>
            <button class="secondary-button" @click="reset()">Reset</button>
          </div>
        </div>
        <div class="hook-card">
          <div class="hook-title">useToggle</div>
          <div class="hook-meta">Switch is {{ isOn ? 'ON' : 'OFF' }}</div>
          <button class="secondary-button" @click="toggleSwitch">Toggle</button>
        </div>
        <div class="hook-card">
          <div class="hook-title">useDebounce</div>
          <input
            v-model="debounceInput"
            class="input"
            type="text"
            placeholder="Type to debounce"
          />
          <div class="hook-meta">Debounced: {{ debouncedSearch }}</div>
        </div>
        <div class="hook-card">
          <div class="hook-title">useThrottle</div>
          <input
            class="input"
            type="text"
            placeholder="Type to throttle"
            v-model="throttleInput"
            @input="(event) => throttledSearch(event.target.value)"
          />
          <div class="hook-meta">Throttled: {{ throttledValue }}</div>
        </div>
        <div class="hook-card">
          <div class="hook-title">useLocalStorage</div>
          <input v-model="storageNote" class="input" type="text" />
          <div class="hook-meta">Stored across reloads.</div>
        </div>
        <div class="hook-card">
          <div class="hook-title">useEventListener</div>
          <div class="hook-meta">
            Pointer: {{ pointer.x }}, {{ pointer.y }}
          </div>
        </div>
        <div class="hook-card">
          <div class="hook-title">usePagination</div>
          <div class="hook-meta">
            Page {{ page }} / {{ totalPages }} (size {{ size }})
          </div>
          <ul class="hook-list">
            <li v-for="item in pagedItems" :key="item">{{ item }}</li>
          </ul>
          <div class="hook-actions">
            <button class="secondary-button" @click="prev">Prev</button>
            <button class="secondary-button" @click="next">Next</button>
          </div>
        </div>
        <div class="hook-card">
          <div class="hook-title">useAsync</div>
          <div class="hook-meta">{{ data || 'No data yet' }}</div>
          <div v-if="error" class="error">{{ error }}</div>
          <button class="secondary-button" @click="run" :disabled="loading">
            {{ loading ? 'Loading...' : 'Run async' }}
          </button>
        </div>
        <div class="hook-card">
          <div class="hook-title">useInterval</div>
          <div class="hook-meta">Ticks: {{ intervalTicks }}</div>
          <div class="hook-actions">
            <button class="secondary-button" @click="startInterval">
              Start
            </button>
            <button class="secondary-button" @click="stopInterval">
              Stop
            </button>
            <span class="hook-meta">
              {{ running ? 'Running' : 'Stopped' }}
            </span>
          </div>
        </div>
        <div class="hook-card">
          <div class="hook-title">Shared workspace package</div>
          <div class="hook-meta">
            formatNumber(1234567) = {{ sharedNumber }}
          </div>
        </div>
        <div class="hook-card worker-card">
          <div class="hook-title">Web Worker (parallel)</div>
          <div class="hook-meta">
            Parallel workers run chunked prime sums with progress updates.
          </div>
          <div class="worker-controls">
            <label class="table-select">
              Limit
              <input
                v-model.number="workerLimit"
                class="input small-input"
                type="number"
                min="2000"
                step="1000"
              />
            </label>
            <label class="table-select">
              Workers
              <input
                v-model.number="workerCount"
                class="input small-input"
                type="number"
                min="1"
                max="8"
              />
            </label>
            <label class="table-select">
              Chunk
              <input
                v-model.number="chunkSize"
                class="input small-input"
                type="number"
                min="500"
                step="500"
              />
            </label>
          </div>
          <div class="hook-actions">
            <button class="secondary-button" @click="enqueueJob">
              Add job
            </button>
            <button class="secondary-button" @click="startNextJob" :disabled="isRunning || !workerQueue.length">
              Start next
            </button>
            <button class="secondary-button" @click="pauseWorkers" :disabled="!isRunning">
              Pause
            </button>
            <button class="secondary-button" @click="resumeWorkers" :disabled="isRunning && !workerTasks.some((t) => t.status === 'paused')">
              Resume
            </button>
            <button class="secondary-button" @click="cancelWorkers" :disabled="!isRunning">
              Cancel
            </button>
            <button class="secondary-button" @click="stopAll">
              Stop all
            </button>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${overallProgress.percent}%` }"></div>
          </div>
          <div class="hook-meta">
            {{ overallProgress.percent }}% · Count {{ overallProgress.count }} · Sum
            {{ overallProgress.sum }}
          </div>
          <div class="hook-meta">
            Active job:
            {{ activeJob ? `${activeJob.id} (${activeJob.status})` : 'None' }}
            · Queue: {{ workerQueue.length }}
          </div>
          <ul v-if="workerQueue.length" class="hook-list">
            <li v-for="job in workerQueue" :key="job.id">
              Job {{ job.id }} · limit {{ job.limit }} · workers
              {{ job.workerCount }}
            </li>
          </ul>
          <div class="worker-grid">
            <div v-for="task in workerTasks" :key="task.id" class="worker-item">
              <div class="hook-meta">
                Worker {{ task.id.slice(-2) }} · {{ task.status }}
              </div>
              <div class="hook-meta">
                {{ task.processed }} / {{ task.total }}
                <span v-if="task.duration"> · {{ task.duration }}ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
