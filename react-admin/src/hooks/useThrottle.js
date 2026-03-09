import { useCallback, useRef } from 'react'

// Throttle a function to avoid excessive calls.
const useThrottle = (callback, delay = 200) => {
  const lastCalled = useRef(0)

  return useCallback(
    (...args) => {
      const now = Date.now()
      if (now - lastCalled.current < delay) return
      lastCalled.current = now
      callback(...args)
    },
    [callback, delay],
  )
}

export { useThrottle }
