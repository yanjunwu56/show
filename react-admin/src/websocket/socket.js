// Socket service simulates real-time connection, grouping, and offline recovery.
const listeners = new Set()
const groups = new Map()
let timer = null
let heartbeatTimer = null
let reconnectTimer = null
let counter = 0
let connected = false
let offlineQueue = []
const throttleBuckets = new Map()

const connect = () => {
  if (timer) return
  connected = true
  // Heartbeat keeps the simulated connection alive.
  heartbeatTimer = setInterval(() => {
    emitMessage({ id: `hb-${Date.now()}`, type: 'heartbeat' })
  }, 10000)
  timer = setInterval(() => {
    counter += 1
    const message = {
      id: `push-${Date.now()}`,
      title: 'Live update',
      body: `New message #${counter} arrived.`,
      read: false,
      time: 'Just now',
      group: counter % 2 === 0 ? 'system' : 'worker'
    }
    emitMessage(message)
  }, 15000)
  flushOfflineQueue()
}

const disconnect = () => {
  connected = false
  if (timer) clearInterval(timer)
  if (heartbeatTimer) clearInterval(heartbeatTimer)
  timer = null
  heartbeatTimer = null
}

const onMessage = (handler) => {
  listeners.add(handler)
  return () => listeners.delete(handler)
}

const scheduleReconnect = () => {
  if (reconnectTimer || connected) return
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    connect()
  }, 2000)
}

const shouldThrottle = (key, windowMs = 4000) => {
  const now = Date.now()
  const last = throttleBuckets.get(key) || 0
  if (now - last < windowMs) return true
  throttleBuckets.set(key, now)
  return false
}

const flushOfflineQueue = () => {
  if (!offlineQueue.length) return
  const queued = [...offlineQueue]
  offlineQueue = []
  queued.forEach((message) => emitMessage(message))
}

const emitMessage = (message) => {
  if (!connected && message?.type !== 'heartbeat') {
    // Offline queue stores messages for later delivery.
    offlineQueue.push(message)
    scheduleReconnect()
    return
  }
  if (message?.group && shouldThrottle(message.group)) {
    // Merge frequent group messages by throttling.
    return
  }
  listeners.forEach((handler) => handler(message))
  if (message?.group) {
    const groupSet = groups.get(message.group) || new Set()
    groupSet.forEach((handler) => handler(message))
  }
}

const subscribe = (group, handler) => {
  const groupSet = groups.get(group) || new Set()
  groupSet.add(handler)
  groups.set(group, groupSet)
  return () => groupSet.delete(handler)
}

const goOffline = () => {
  disconnect()
}

export { connect, disconnect, onMessage, emitMessage, subscribe, goOffline }
