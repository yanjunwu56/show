const listeners = new Set()
let timer = null
let counter = 0

const connect = () => {
  if (timer) return
  timer = setInterval(() => {
    counter += 1
    const message = {
      id: `push-${Date.now()}`,
      title: 'Live update',
      body: `New message #${counter} arrived.`,
      read: false,
      time: 'Just now'
    }
    listeners.forEach((handler) => handler(message))
  }, 15000)
}

const disconnect = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const onMessage = (handler) => {
  listeners.add(handler)
  return () => listeners.delete(handler)
}

const emitMessage = (message) => {
  listeners.forEach((handler) => handler(message))
}

export { connect, disconnect, onMessage, emitMessage }
