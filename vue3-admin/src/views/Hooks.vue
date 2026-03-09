<script setup>
defineOptions({ name: 'Hooks' })

import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { useAsync } from '../hooks/useAsync'
import { useCounter } from '../hooks/useCounter'
import { useDebounce } from '../hooks/useDebounce'
import { useEventListener } from '../hooks/useEventListener'
import { useInterval } from '../hooks/useInterval'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { usePagination } from '../hooks/usePagination'
import { useThrottle } from '../hooks/useThrottle'
import { useToggle } from '../hooks/useToggle'

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

const workerResult = ref('')
const workerLoading = ref(false)
const workerLimit = ref(20000)
let worker = null

const runWorker = () => {
  if (!worker) return
  workerLoading.value = true
  workerResult.value = ''
  worker.postMessage({
    type: 'sumPrimes',
    payload: { limit: workerLimit.value }
  })
}

const initWorker = () => {
  if (worker) return
  // Web Worker offloads heavy math from the UI thread.
  worker = new Worker(new URL('../workers/computeWorker.js', import.meta.url), {
    type: 'module'
  })
  worker.addEventListener('message', (event) => {
    const { type, payload } = event.data || {}
    if (type === 'sumPrimes') {
      workerLoading.value = false
      workerResult.value = `Count: ${payload.count}, Sum: ${payload.sum}, ${payload.duration}ms`
    }
  })
}

const stopWorker = () => {
  if (worker) {
    worker.terminate()
    worker = null
  }
}

onMounted(() => {
  initWorker()
})

onUnmounted(() => {
  stopWorker()
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
          <div class="hook-title">Web Worker</div>
          <div class="hook-meta">
            Heavy math is offloaded to a worker thread.
          </div>
          <input
            v-model.number="workerLimit"
            class="input"
            type="number"
            min="1000"
            step="1000"
          />
          <button class="secondary-button" @click="runWorker" :disabled="workerLoading">
            {{ workerLoading ? 'Running...' : 'Run primes' }}
          </button>
          <div class="hook-meta">{{ workerResult || 'Waiting for result' }}</div>
        </div>
      </div>
    </div>
  </section>
</template>
